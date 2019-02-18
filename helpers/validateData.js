module.exports = (...args)=>{
    const dataArr = args;
    var check = true;
    for (let i = 0; i < dataArr.length; i++) {
       var data = dataArr[i];
    //    console.log(data)
        if(data === '' || data === undefined){
            check = false;
            break;
        }
    }
    return check;
}