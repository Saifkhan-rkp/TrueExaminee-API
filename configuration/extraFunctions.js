
const shuffled_array = (arr)=>{
    // let arr= new Array(length);
    // for (let i = 0; i < arr.length; i++) {
    //     arr[i]=i;
        
    // }
    var ctr = arr.length, temp, index;
    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arr[ctr];
        arr[ctr] = arr[index];
        arr[index] = temp;
    }
    console.log(arr);
    return arr;
};

const localTime = (cur_date,duration)=>{
    if (duration) {
        const temp_time = new Date(cur_date.getTime() + duration+1 * 60000);
        return temp_time;
    }
    return new Date((cur_date.getTime() + (-cur_date.getTimezoneOffset() * 60000))).toISOString();
};

module.exports ={
    shuffled_array,
    localTime
};