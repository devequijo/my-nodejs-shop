const {MongoClient} = require("mongodb");

const url = `mongodb+srv://localhost/backendInterview`

const main = async () => {
    const client = await MongoClient.connect(url, 
        { useNewUrlParser: true, useUnifiedTopology:true })
    const st = client.db().collection('first')
    getCount = st.aggregate([
        
        {$facet:{

            'getOverall':[
                // {$addFields:{number:null}},
                {$lookup:{
                    from:"second",
                    localField:'number',
                    foreignField:'overallStudents.number',
                    as:'cosas'
                }},
                {$group:{"_id":"true", cosas:{$last:'$cosas'}}},
            ],
            'more':[
        {$group:{"_id":"$country", count:{$sum : 1}, 
        longitude:{$push:{ $arrayElemAt: [ "$location.ll", 0 ] }},
        latitude:{$push:{ $arrayElemAt: [ "$location.ll", 1 ] }}, 
        students:{$push : "$students.number"}
        },
     },
    
            ],}}
    
        
    ]).toArray().then(data=>{data.forEach(items=>{
        let tempObj = {
            _id:null,
            arr:[]
        }
        client.db().collection('third').insertMany(items.more)
          items.more.forEach(item=>{
              item.students.forEach(arr =>{
                  arr.map((v,i,a)=>{
                    items.getOverall[0].cosas.forEach(ops=>{
                        if (ops.country==item._id){
                            tempObj._id = item._id
                            tempObj.arr.push((v-ops.overallStudents)>0?v-ops.overallStudents:ops.overallStudents-v)
                        }
                    })
                  })
              })
              client.db().collection('third').updateOne({_id:tempObj._id},{ $set: {allDifs:tempObj.arr} })
              tempObj.arr=[]
          })
    })})
}
main()

    