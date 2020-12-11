module.exports = {

    calcPrice : (cantidad, prceioFinal) =>
    {
        let res = (cantidad*prceioFinal)/50
        return res.toFixed(2)
    }, 

    cartLimit : (inCart)=>{
        if (inCart.length>2){
            return `${inCart[0].articulo.name}`
        }
    }

}

