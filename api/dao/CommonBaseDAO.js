const XRegExp = require('xregexp')
const _ = require('lodash')

function generateIncludes (model, includes, option, associationAttributes) {
  if (!(includes instanceof Array)) {
    includes = [includes]
  }

  const findAssociation = (topInclude, associationModelTarget, topAssociationAttributes) => {
    let associationAttributes = null
    let lastTargetAssociationModel = null
    const associationFinal = []
    const associationsMatch = XRegExp.matchRecursive(topInclude, '\\(', '\\)', 'g', { valueNames: ['between', 'left', 'match', 'right'] })
    const associationsMatchLength = associationsMatch.length

    for (let idx = 0; idx < associationsMatchLength; idx++) {
      const associationMatch = associationsMatch[idx]
      if (associationMatch.name === 'between') {
        const associations = associationMatch.value.split(',')
        associations.forEach(association => {
          const isImportant = association.indexOf('*') === 0
          const isOptional = association.indexOf('!') === 0
          association = association.replace('*', '').replace('!', '')
          associationAttributes = topAssociationAttributes && topAssociationAttributes.filter(attribute => attribute.indexOf(association) === 0)
          const attributes = associationAttributes.filter(attribute => attribute.split('.').length === 2).map(attribute => attribute.split('.')[1])
          associationAttributes = associationAttributes.filter(attribute => attribute.split('.').length > 2).map(attribute => attribute.split(/\.(.+)/)[1])
          if (association && associationModelTarget.associations[association]) {
            const associationModel = associationModelTarget.associations[association]
            lastTargetAssociationModel = associationModel.target
            const model = {
              model: lastTargetAssociationModel
            }
            if (isImportant) {
              model.required = true
            } else if (!isImportant && isOptional) {
              model.required = false
            }
            if (associationModel.isAliased) {
              model.as = associationModel.as
            }
            if (attributes && attributes.length > 0) {
              model.attributes = attributes
            }

            associationFinal.push(model)
          }
        })

        if (lastTargetAssociationModel && associationsMatch[idx + 2] && associationsMatch[idx + 2].name === 'match') {
          idx += 2
          associationFinal[associationFinal.length - 1].include = findAssociation(associationsMatch[idx].value, lastTargetAssociationModel, associationAttributes)
        }
      }
    }

    return associationFinal
  }

  option.include = includes.map(include => {
    if (typeof include === 'string') {
      return findAssociation(include, model, associationAttributes)[0]
    } else {
      return include
    }
  }).filter(include => !!include && include.model)
  return includes
}

class BaseDAO {
  constructor (options) {
    const { model, relations, sequelize, Op, useSiteId = true } = options
    this.model = model
    this.relations = relations
    this.sequelize = sequelize
    this.Op = Op
    this.useSiteId = useSiteId
  }

  list ({ where = {}, order, filter, offset, limit, strictFilter, grouping, attributes = [], includes, siteId }, option = {}) {
    let associationAttributes = []
    option.where = where

    if (!(attributes instanceof Array)) {
      attributes = [attributes]
    }

    if (attributes.length > 0) {
      option.attributes = attributes.filter(attribute => attribute instanceof Object || attribute.indexOf('.') === -1)
      associationAttributes = attributes.filter(attribute => !(attribute instanceof Object) && attribute.indexOf('.') > 0)
    }

    if (includes !== 'false' && !option.include) {
      if (includes === 'true') {
        if (this.relations) {
          option.include = this.relations
          option.distinct = true
        }
      } else {
        option.distinct = true
        generateIncludes(this.model, includes, option, associationAttributes)
      }
    }

    if (limit >= 0) {
      option.limit = parseInt(limit)
      option.offset = parseInt(offset)
    }
    if (!(order[0] instanceof Array)) {
      order = [[order[0]], [order[1]]]
    }
    option.order = []
    order[0].forEach((column, idx) => {
      if (order[1][idx] !== '' && column !== '') {
        if (column.indexOf('.') > -1) {
          const association = column.split('.')
          if (column.indexOf('$') === 0 && column.lastIndexOf('$') === column.length - 1) {
            option.order.push([this.sequelize.literal(`"${association.map(column => (column.replace('$', ''))).join('.')}" ${order[1][idx]}`)])
          } else {
            const relation = option.include && option.include.filter(include => {
              const alias = include.as ? include.as : include.model.name
              return alias === association[0]
            })

            if (relation && relation.length > 0) {
              option.order.push([{ model: relation[0].model, as: relation[0].as }, association[1], order[1][idx]])
            }
          }
        } else {
          option.order.push([column, order[1][idx]])
        }
      }
    })

    if (!(filter[0] instanceof Array)) {
      filter = [[filter[0]], [filter[1]]]
    }

    if (!strictFilter) {
      grouping = 'or'
    }

    if (grouping) {
      strictFilter = null
      if (!(grouping instanceof Array)) {
        grouping = filter.map(() => grouping)
      }
    } else {
      // strictFilter is deprecated, will removed soon
      if (!(strictFilter instanceof Array)) {
        strictFilter = filter.map(() => strictFilter)
      }
    }

    filter[0].forEach((column, idx) => {
      if (filter[1][idx] !== null && filter[1][idx] !== '' && column !== '') {
        const value = filter[1][idx]

        let operand = ''
        let filterValue = []
        if (column.indexOf('$') === 0 || (strictFilter && strictFilter[idx] === 'true')) {
          if (!(strictFilter) || (strictFilter && strictFilter[idx] !== 'true')) {
            const match = /(\w.+)\((.+)\)/g
            const result = match.exec(column)
            column = result[2]
            operand = this.Op[result[1]]
          }
          switch (value) {
            case 'null': {
              filterValue = null
              break
            }
            case '': {
              filterValue = ''
              break
            }
            default: {
              const splitMatch = /"[^"]*"|[^,]+/g
              let splitResult
              while ((splitResult = splitMatch.exec(value))) {
                filterValue.push(splitResult[0].replace(/"/g, ''))
              }
              if (filterValue.length === 1) {
                filterValue = filterValue[0]
              }
            }
          }
        } else {
          operand = this.Op.iLike
          filterValue = `%${value === 'null' ? '' : value}%`
        }

        const filterColumn = column.split(',')
        const filterGroup = {}

        let conditionSymbol
        if (strictFilter) {
          if (strictFilter[idx] === 'true') {
            conditionSymbol = this.Op.and
            if (filterValue instanceof Array) {
              operand = this.Op.in
            } else {
              operand = this.Op.eq
            }
          } else {
            conditionSymbol = this.Op.or
          }
        } else {
          conditionSymbol = this.Op[grouping[idx] || 'or']
        }

        const filterObject = {
          [operand]: filterValue
        }
        filterColumn.forEach(column => {
          if (column.indexOf('.') > -1 && column.indexOf('*') !== 0) {
            const findAssociationCondition = (topColumn, topInclude) => {
              const [column, columnAssociation] = topColumn.split(/\.(.+)/)
              const include = topInclude

              const relation = include && include.find(include => {
                const alias = include.as ? include.as : include.model.name
                return alias === column
              })

              if (relation) {
                if (columnAssociation.split('.').length > 1) {
                  findAssociationCondition(columnAssociation, relation.include)
                } else {
                  if (!relation.where) {
                    relation.where = {}
                  }

                  if (relation.where[conditionSymbol]) {
                    relation.where[conditionSymbol].push({
                      [columnAssociation]: filterObject
                    })
                  } else {
                    relation.where[conditionSymbol] = [{
                      [columnAssociation]: filterObject
                    }]
                  }
                }
              }
            }

            findAssociationCondition(column, option.include)
          } else {
            if (column.includes('*')) {
              column = `${column.replace(/\*/g, '$')}$`
            }
            if (column.includes('->')) {
              column = column.replace(/->/g, '.')
            }
            if (filterColumn.length > 1) {
              filterGroup[this.Op.or] = {
                ...filterGroup[this.Op.or],
                [column]: filterObject
              }
            } else {
              filterGroup[column] = {
                ...filterGroup[column],
                ...filterObject
              }
            }
          }
        })

        if (Object.getOwnPropertySymbols(filterGroup).length > 0 || Object.keys(filterGroup).length > 0) {
          if (where[conditionSymbol]) {
            where[conditionSymbol].push(filterGroup)
          } else {
            where[conditionSymbol] = [
              filterGroup
            ]
          }
        }
      }
    })

    const queryModel = this.useSiteId && !!siteId ? this.model.scope({ method: ['site', siteId] }) : this.model

    return queryModel.findAndCountAll(option)
  }

  detail (where, { attributes = [], includes } = {}, options = {}) {
    let associationAttributes = []
    options = {
      where,
      ...options
    }

    if (!(attributes instanceof Array)) {
      attributes = [attributes]
    }

    if (attributes.length > 0) {
      options.attributes = attributes.filter(attribute => attribute.indexOf('.') === -1)
      associationAttributes = attributes.filter(attribute => attribute.indexOf('.') > 0)
    }

    if (includes !== 'false' && !options.include) {
      if (includes === 'true') {
        if (this.relations) {
          options.include = this.relations
        }
      } else {
        generateIncludes(this.model, includes, options, associationAttributes)
      }
    }

    return this.model.findOne(options)
  }

  create (param, transaction, options = {}, isAsync = false) {
    if (Array.isArray(param)) {
      const chunkInsert = (array, chunk, size) => {
        const result = this.bulkCreate(chunk, transaction, options)
        if (array.length > 0) {
          const chunkData = array.splice(0, size)
          return result.then(() => {
            return chunkInsert(array, chunkData, size)
          })
        } else {
          return result
        }
      }

      const chunkSize = 1000
      const objectLength = param.length
      const chunkData = param.splice(0, chunkSize)
      return new Promise(resolve => {
        const insertProcess = chunkInsert(param, chunkData, chunkSize)

        if (isAsync) {
          resolve(true)
        } else {
          insertProcess.then(() => {
            resolve({
              totalObject: objectLength
            })
          })
        }
      })
    }
    const defaultOptions = {
      // individualHooks: true,
      returning: true
    }

    if (this.relations) {
      defaultOptions.include = this.relations
    }
    if (transaction) {
      defaultOptions.transaction = transaction
    }

    return this.model.create(param, {
      ...defaultOptions,
      ...options
    })
  }

  update (param, where, transaction, options = {}) {
    const defaultOptions = {
      // individualHooks: true,
      where,
      returning: true
    }

    if (this.relations) {
      defaultOptions.include = this.relations
    }
    if (transaction) {
      defaultOptions.transaction = transaction
    }

    return this.model.update(param, {
      ...defaultOptions,
      ...options
    })
  }

  destroy (where, transaction, options = {}) {
    const defaultOptions = {
      // individualHooks: true,
      where
    }

    if (this.relations) {
      defaultOptions.include = this.relations
    }
    if (transaction) {
      defaultOptions.transaction = transaction
    }

    return this.model.destroy({
      ...defaultOptions,
      ...options
    })
  }

  bulkCreate (params, transaction, options = {}) {
    const defaultOptions = {
      returning: true
    }
    if (transaction) {
      defaultOptions.transaction = transaction
    }

    const belongsToManyModel = []
    Object.keys(this.model.associations).forEach(associationKey => {
      const association = this.model.associations[associationKey]
      if (association.associationType === 'BelongsToMany') {
        belongsToManyModel.push({
          model: association,
          name: associationKey
        })
      }
    })

    this.model.removeHook('afterBulkCreate', 'afterBulkCreateHook')
    this.model.addHook('afterBulkCreate', 'afterBulkCreateHook', (instances, options) => {
      instances.forEach((instance, idx) => {
        const param = params[idx]
        belongsToManyModel.forEach(({ name: associationKey, model: associationModel }) => {
          if (param[associationKey]) {
            const values = []
            param[associationKey].forEach(modelObject => {
              if (modelObject.id) {
                const ClassModel = associationModel.target
                const associationValue = new ClassModel(modelObject)
                Object.keys(modelObject).forEach(detailKey => {
                  if (modelObject[detailKey] instanceof Object) {
                    associationValue[detailKey] = modelObject[detailKey]
                  }
                })
                values.push(associationValue)
              }
            })
            if (values.length > 0) {
              instance[_.camelCase(`set ${associationKey}`)](values)
            }
          }
        })
      })
    })

    return this.model.bulkCreate(params, {
      ...defaultOptions,
      ...options
    })
  }
}

module.exports = BaseDAO
