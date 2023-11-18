class APIFEATURES {
    constructor(query, queryStr){
      this.query = query
      this.queryStr = queryStr
    }
    filter(){
      const queryObj = {...this.queryStr}
      const excludedQueries = ['sort', 'page', 'limit', 'fields']
      excludedQueries.forEach(el => delete queryObj[el])
  
      //stringfy queryObj to accomodate gte,gt,lte,lt
      let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(/(gte|gt|lte|lt)/g, str => `$${str}`);
      this.query = this.query.find(JSON.parse(queryStr))
      return this
    }
    sort(){
       if(this.queryStr.sort){
        const sortBy = this.queryStr.sort.split(',').join(' ')
        this.query = this.query.sort(sortBy)
       }else{
        this.query = this.query.sort('-date')
       }
       return this
    }
    limitFields(){
      if(this.queryStr.fields){
        const fields = this.queryStr.fields.split(',').join(' ')
        this.query = this.query.select(fields)
       }
      return this
    }
    pagination(){
      const page = this.queryStr.page*1||1
      const limit = this.queryStr.limit*1||50
      const skip = (page-1)*limit
      this.query = this.query.skip(skip).limit(limit)
      return this
    }
  }

  module.exports = APIFEATURES