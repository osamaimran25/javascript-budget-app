// Budget Controller

var budgetController = ( function(){

var Expense= function(id , description, value){

this.id = id;
this.description = description;
this.value = value;
this.percentage = -1;

};


Expense.prototype.calcPercentage = function(totalIncome){
    if (totalIncome >0) {

        this.percentage=Math.round((this.value / totalIncome) * 100);

    }
    else{
        this.percentage = -1;
    }

} ;

Expense.prototype.getPercentage = function(){

return this.percentage;

}

var Income = function(id , description , value){
    this.id = id;
    this.description = description;
    this.value = value;
};


var calculateTotal = function(type){
var sum = 0;
DataCue.allItems[type].forEach(function(cur){
sum += cur.value;
});
data.totals[type] = sum;

};
 var data = {
    allItems:{
        exp :[] ,
        inc :[]
},
    totals:{
        exp : 0,
        inc:0

    },
    budget : 0 ,
    percentage: -1

}

return {
    addItem: function(type , des, val){
        var newItem , ID;
    
    
    
    
    if (data.allItems[type].length >0){
        // i have to find this
        ID = data.allItems[type] [data.allItems[type.length] - 1].id + 1;
    }
    else{
        ID = 0;
    }
    // create new exp or inc object by checking type.
    if (type === 'exp') {
        newItem = new Expense(ID , des , val);
    } else if (type === 'inc'){
        newItem = new Income(ID, des , val);

    }
    data.allItems[type].push(newItem);   
    
    return newItem;

},
deleteItem : function (type , id){
    var ids , index;


// I have to check this also
ids=  data.allItems[type].map(function(current){
    return current.id;
});
index = ids.indexOf(id);

if (index !== -1){
   // this will also check
    data.allItems[type].splice(index , 0);

}

} , 

calculateBudget: function(){

    calculateTotal('exp');
    calculateTotal('inc');


    data.budget = data.totals.inc - data.totals.exp;

    if (data.totals.inc >0){

        data.percentage = Math.round(data.totals.ex / data.totals.inc) * 100 ;

    } else {
        data.percentage = -1 ;

    }

},
 calculatePercetages:  function(){
    /*
            a=20
            b=10
            c=40
            income = 100
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */

        data.allItems.exp.forEach(function(cur){
            cur.calcPercentage(data.totals.inc);

        });

},
getPercentages : function() {
        var allPerc = data.allItems.exp.map(function(cur){
        
            return cur.getPercentage();
        });
        return allPerc;

},

    getBudget: function(){
        return {
            budget : data.budget,
            totalInc: data.totals.inc,
            totalExp : data.totals.exp,
            percentage : data.percentage 

        };
    
    },

    testing : function(){
        console.log(data);

    }


    
};

}) ();

// UI Controller 
var  UIController = ( function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
   
        var formatNumber =  function(num , types) {
                var numSplit , int, dec, type ;

            /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */
            num = Math.abs(num);
            num = num.toFixed(2);

            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3) {
                int = int.substr(0 , int.length - 3) + ',' + int.substr(int.length - 3, 3);
            } 
            dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec ;
        }; 
        
        var nodeListForEach = function(list , callback){
            for (var i = 0; i < list.length; i ++) {

                callback(list[i] , i);
            }
        };



    return{}      

    })
