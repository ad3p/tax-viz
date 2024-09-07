// round and change to indian number system
function indianNumSys(amount){
    amount = Math.round((amount)*100)/100
    var temp = [];
    var ones = amount % 1000;
    var tens = ((amount % 100000) - ones)/1000;
    var huns = ((amount) - tens*1000 - ones)/100000;
    temp = [huns,("0" + tens).slice(-2),("00" + Math.round(ones)).slice(-3)];
    if(temp[0] == 0){
        temp.shift();
    }
    return temp;
}



function calcTax(income){

    incomeLakh = income * 1e5;

    // standard deduction, cess rate
    var deductionAmount = 75000;
    var cess = 0.04

    if(deductionAmount > incomeLakh){
        // alert("Deductions are more than income.")
        deductionAmount = incomeLakh;
    }

    var amt = incomeLakh - deductionAmount;
    
    // tax according to each brackets
    var tax = [0,0,0,0,0,0];
    // brackets
    var b = [3,7,10,12,15];
    // tax rate for each bracket
    var r = [0,.05,.10,.15,.20,.30]
    // converting into lakh
    for(let i=0; i<b.length; i++){
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
    tax[4] = ( amt > b[3] ) ? ( amt > b[4] ? (b[4] - b[3]) : (amt - b[3])) : 0;
    tax[5] = ( amt > b[4] ) ? ( amt - b[4] ) : 0;

    // calculating tax amount by multiplying with rate for that tax bracket.
    tax[0] = tax[0] * r[0];
    tax[1] = tax[1] * r[1];
    tax[2] = tax[2] * r[2];
    tax[3] = tax[3] * r[3];
    tax[4] = tax[4] * r[4];
    tax[5] = tax[5] * r[5];

    // Section 87 A
    if(amt <= 700000){
        tax[1] = 0;
    }

    // updating tax amount in html
    dIn.innerHTML = income;
    dT1.innerHTML =  tax[0];
    dT2.innerHTML =  Math.round(tax[1]*100)/100;
    dT3.innerHTML =  Math.round(tax[2]*100)/100;
    dT4.innerHTML =  Math.round(tax[3]*100)/100;
    dT5.innerHTML =  Math.round(tax[4]*100)/100;
    dT6.innerHTML =  Math.round(tax[5]*100)/100;

    
    // total tax = tax amount + cess(4%)
    var totalTax = tax[0] + tax[1] + tax[2] + tax[3] + tax[4] + tax[5];
    var cessAmt = cess * totalTax;

    dTBC.innerHTML = Math.round(totalTax * 100)/100;
    dTC.innerHTML = Math.round(cessAmt * 100)/100;
    dTt.innerHTML = Math.round((cessAmt + totalTax)*100)/100;

    dTIn.innerHTML = Math.round(amt*100)/10000000;
    dTt2.innerHTML = indianNumSys((cessAmt + totalTax));

    // first bracket
    for(let i=0;i<((b[0] > incomeLakh ? incomeLakh : b[0]));i+=10000){
        bN[0].innerHTML += "<button class='gg'>.</button>";
    }

    for(let i=b[4];i<((b[4] < incomeLakh ? incomeLakh : b[4]))-tax[5];i+=10000){
        bN[5].innerHTML += "<button class='gg'>.</button>";
    }

    // last bracket
    for(let i=10000;i<=tax[5];i+=10000){
        bN[5].innerHTML += "<button class='rr'>.</button>";
    }

    // in between brackets
    for(let j=1; j<5;j++){
        for(let i=b[j-1];i<((b[j] > incomeLakh ? incomeLakh : b[j]))-tax[j];i+=10000){
            bN[j].innerHTML += "<button class='gg'>.</button>";
        }
        
        for(let i=10000;i<=tax[j];i+=10000){
            bN[j].innerHTML += "<button class='rr'>.</button>";
        }
    }
    
    
}

// t - table
// d - display

var dIn = document.getElementById("t-income");
var dT1 = document.getElementById("t-tax0");
var dT2 = document.getElementById("t-tax1");
var dT3 = document.getElementById("t-tax2");
var dT4 = document.getElementById("t-tax3");
var dT5 = document.getElementById("t-tax4");
var dT6 = document.getElementById("t-tax5");
var dTBC = document.getElementById("t-taxBeforeCess");
var dTC = document.getElementById("t-taxCess");
var dTt = document.getElementById("t-total");
var dTIn = document.getElementById("d-taxableIncome");
var dTt2 = document.getElementById("d-total2");

var bN = [];

// get all brackets to fill boxes
for(let j=0;j<6;j++){
    bN[j] = document.getElementById("bracket"+j);
}


var slider = document.getElementById("incomeSlider");
var incomeOut = document.getElementById("incomeOut");

slider.oninput = function(){
    incomeOut.innerHTML = this.value;
   
    for(let j=0;j<6;j++){
        bN[j].innerHTML = "";
    }

    calcTax(this.value);   
}