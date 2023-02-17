// function shuffle(arra1) {
//     var ctr = arra1.length, temp, index;

// // While there are elements in the array
//     while (ctr > 0) {
// // Pick a random index
//         index = Math.floor(Math.random() * ctr);
// // Decrease ctr by 1
//         ctr--;
// // And swap the last element with it
//         temp = arra1[ctr];
//         arra1[ctr] = arra1[index];
//         arra1[index] = temp;
//     }
//     return arra1;
// }
// // console.log(new Date(),'\n',new Date().getTimezoneOffset());
// // var x = new Date();
// // var offset= -x.getTimezoneOffset();
// // var time = x.toISOString()
// // console.log((offset>=0?"+":"-")+parseInt(offset/60)+":"+offset%60)

// var myArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// const localTime = (cur_date,duration)=>{
//     if (duration) {
//         const temp_time = new Date(cur_date.getTime() + duration * 60000);
//         // server Date returns not browsers time ! string
//         return temp_time;
//     }
//     //imp for date matching //returns a string 
//     return new Date((cur_date.getTime() + (-cur_date.getTimezoneOffset() * 60000))).toISOString();
// };

// console.log(new Date()>localTime(new Date(),30),"\n");
// //console.log(localTime(new Date(),30)-new Date()<0);

// const shuffled_array = (length)=>{
//     let arr= new Array(length);
//     for (let i = 0; i < arr.length; i++) {
//         arr[i]=i;
        
//     }
//     var ctr = arr.length, temp, index;
//     // While there are elements in the array
//     while (ctr > 0) {
//         // Pick a random index
//         index = Math.floor(Math.random() * ctr);
//         // Decrease ctr by 1
//         ctr--;
//         // And swap the last element with it
//         temp = arr[ctr];
//         arr[ctr] = arr[index];
//         arr[index] = temp;
//     }
//     console.log(shuffle(arr));
//     return arr;
// };
// var ary =[{
//     "question": "1this is a Question and you have to solve it....",
//     "options": ["opA","opB","opC","opD"],
//     "answer_key": "opC"
// },
// {
//     "question": "2this is a Question and you have to solve it....",
//     "options": ["opA","opB","opC","opD"],
//     "answer_key": "opC"
// }
// ];
// const temp_result = new Object({"question": "1this is a Question and you have to solve it....",
// "options": ["opA","opB","opC","opD"],
// "answer_key": "opC"});
// //console.log(temp_result);

// const removeEle = (ary)=>{
//     ary.forEach(element => {
//        delete element.answer_key;
//     });
// };
// //removeEle(ary);
// //shuffled_array(10);
// let ass = 1;
// if (!ass) {
//     console.log('fuck');
// }else{
//     console.log('not fuck');
// }

function tester() {
    var message;
    if (confirm("Press a button!")) {
      message = "You pressed OK!";
    } else {
      message = "You pressed Cancel!";
    }
    console.log(message);
  }
  tester();
  