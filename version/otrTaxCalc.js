function alertHighLimit(){
    alert("Value is higher than limit. Enter a smaller amount");
}

// clear graph for next print
function clearGraph(){
    for(let j=0;j<4;j++){
        bN[j].innerHTML = "";
    };
}

var amount = 0;
// round and change to indian number system
function indianNumSys(amount){
    // console.log(amount);
    amount = Math.round((amount)*100)/100
    var temp = [];
    var ones = amount%1000;
    var tens = ((amount % 100000) - ones)/1000;
    var huns = ((amount) - tens*1000 - ones)/100000;
    temp = [huns,("0" + tens).slice(-2),("00" + Math.round(ones)).slice(-3)];
    if(temp[0] == 0){
        temp.shift();
    }
    return temp;
    // return amount;
}


function calcTax(income){
    
    incomeLakh = income * 1e5;
    var deductionAmount = 0;

    for(var d of deductions){
        // console.log(d);
        deductionAmount += parseFloat(d);
    }
    // cess rate

    var cess = 0.04

    if(deductionAmount > incomeLakh){
        alert("Deductions are more than income.")
        deductionAmount = incomeLakh;
    }


    var amt = incomeLakh - deductionAmount;

   
    var tax = [0,0,0,0,0,0];
    // brackets
    var b = [2.5,5,10];
    // tax rate for each bracket
    var r = [0,.05,.20,.30]
    // converting into lakh
    for(let i=0; i<b.length;i++){
        b[i] = b[i] * 1e5;
    }
    
    // comparison to calc taxable amount
    // 8 lakh, >7 lakh - yes, >10 lakh - N0, therefore taxable amount for that bracket = 8-7 = 1 lakh
    // first comparing lower limit, then upper limit
    // if greater than upper limit then tax amt = upper - lower else given amt - lower
    tax[0] = ( amt < b[0] ) ? amt : b[0];
    tax[1] = ( amt > b[0] ) ? ( amt > b[1] ? (b[1] - b[0]) : (amt - b[0])) : 0;
    tax[2] = ( amt > b[1] ) ? ( amt > b[2] ? (b[2] - b[1]) : (amt - b[1])) : 0;
    tax[3] = ( amt > b[2] ) ? ( amt > b[3] ? (b[3] - b[2]) : (amt - b[2])) : 0;

    // calculating tax amount by multiplying with rate for that tax bracket.
    tax[0] = tax[0] * r[0];
    tax[1] = tax[1] * r[1];
    tax[2] = tax[2] * r[2];
    tax[3] = tax[3] * r[3];
  

    // updating tax amount in html
    dIn.innerHTML = income;
    dDdXn.innerHTML = Math.round(deductionAmount*.01)/1000;
    
    //Math.round(x*100)/100 - round till 2 digit
    dTIn.innerHTML = Math.round(amt*.01)/1000;
    dT1.innerHTML =  tax[0];
    dT2.innerHTML =  Math.round(tax[1]*100)/100;
    dT3.innerHTML =  Math.round(tax[2]*100)/100;
    dT4.innerHTML =  Math.round(tax[3]*100)/100;

    
    // total tax = tax amount + cess(4%)
    var totalTax = tax[0] + tax[1] + tax[2] + tax[3];
    var cessAmt = cess * totalTax;

    dTBC.innerHTML = Math.round(totalTax * 100)/100;
    dTC.innerHTML = Math.round(cessAmt * 100)/100;
    dTt.innerHTML = Math.round((cessAmt + totalTax)*100)/100;

    dTIn2.innerHTML = Math.round(amt*.01)/1000;
    dTt2.innerHTML = indianNumSys((cessAmt + totalTax));

    // first bracket
    for(let i=0;i<((b[0] > incomeLakh ? incomeLakh : b[0]));i+=5000){
        bN[0].innerHTML += "<button class='gg'>.</button>";
        
    }

    // last bracket
    for(let i=b[2];i<((b[2] < incomeLakh ? incomeLakh : b[2]))-tax[3];i+=5000){
        bN[3].innerHTML += "<button class='gg'>.</button>";
    }
    for(let i=5000;i<=tax[3];i+=5000){
        bN[3].innerHTML += "<button class='rr'>.</button>";
    }

    // in between brackets
    for(let j=1; j<3;j++){
        for(let i=b[j-1];i<((b[j] > incomeLakh ? incomeLakh : b[j]))-tax[j];i+=5000){
            bN[j].innerHTML += "<button class='gg'>.</button>";
           
        }
        
        for(let i=5000;i<=tax[j];i+=5000){
            bN[j].innerHTML += "<button class='rr'>.</button>";
        }
    }    
    
}

// t - table
// d - display

var dIn = document.getElementById("t-income");
var dDdXn = document.getElementById("t-deduction");
var dTIn = document.getElementById("t-taxableIncome");

var dT1 = document.getElementById("t-tax0");
var dT2 = document.getElementById("t-tax1");
var dT3 = document.getElementById("t-tax2");
var dT4 = document.getElementById("t-tax3");
var dTBC = document.getElementById("t-taxBeforeCess");
var dTC = document.getElementById("t-taxCess");
var dTt = document.getElementById("t-total");
var dTIn2 = document.getElementById("d-taxableIncome-2");
var dTt2 = document.getElementById("d-total2");

var slider = document.getElementById("incomeSlider");
var incomeOut = document.getElementById("incomeOut");



// deduction inputs
var dedXnIDs = [
    document.getElementById("d80C"),
    document.getElementById("d80CCD"),
    document.getElementById("d80D"),
    document.getElementById("d80TTA"),
    document.getElementById("d80E"),
    document.getElementById("d80EEA")
]

var deductions = [0,0,0,0,0,0,50000];
var dedXnMaxVal = [150000, 50000, 75000, 10000, 2000000, 150000];
// console.log(dedXnMaxVal[0]);
var index;

// for adding input values to the dedXn amount array
// on input, it first finds the index of input box, then check
// whether its value is below max limit, otherwise it gives an error
// and reset input value to max.
for (var i=0; i<dedXnIDs.length; i++){
    dedXnIDs[i].oninput = function(){

        index = dedXnIDs.indexOf(this);

        if(isNaN(this.value.charCodeAt(0))){           
            this.value = "0";
            // console.log("don't know why this work");
        }
 
        if(this.value < dedXnMaxVal[index]){
            deductions[index] = this.value;
        }else{
            alertHighLimit();
            this.value = dedXnMaxVal[index];
            // console.log(this.value);
            deductions[index] = this.value;
            // console.log(deductions);
        }
        clearGraph();
        calcTax(slider.value);

    }
}


// get bracket box in array
var bN = [];

for(let j=0;j<4;j++){
    bN[j] = document.getElementById("bracket"+j);
}



slider.oninput = function(){
    incomeOut.innerHTML = this.value;
    clearGraph();
    calcTax(this.value);
  
}