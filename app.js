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



    return{
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },


       addListItem : function(obj , type){
        var html , newHtml , element ;


        if (type === 'inc'){
            element = DOMstrings.incomeContainer;
         
            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        } else if (type == 'exp'){
           
            element = DOMstrings.expensesContainer;

            html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
            newHtml = html.replace('%id%' , obj.id);
            newHtml = newHtml.replace('%description%' , obj.description);
            newHtml = newHtml.replace('%value%' , obj.value); 

            document.querySelector(element).insertAdjacentHtml('beforeend' , newHtml)



        },

        deleteListItem : function(selectorID){
        var el = document,getElementById(selectorID);
        
        el.parentNodde.removeChild(el);


        },

        clearFix: function {
            var fields , fieldsArr ;
            
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputType);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = " ";


            });
            fieldsArr[0].focus();

        },


        displayBudget : function(obj) {
            var type ;

            obj.budget > 0 ? type = 'inc' : tyepe = 'exp' ;

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget , type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc , 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp , 'exp');


            if (obj.perc > 0 ) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obje.percentage;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'; 
            }



        },


        DisplayPerccentages : function(percentage){
            var fields = document.querySelector(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields , function(current, index){

                if (percentage[index] > 0 ){
                    current.textContent = percentage[index] + '%';
    
                } else {
                    current.textContent = '---' ;
                }
    
    

            } );
        },

        displayMonth: function() {
            var now , months, month , year;

            now = new Data();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month.getYear();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year; 

        },
    
        changeType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ' ,' + DOMstrings.inputValue);
    
                nodeListForEach(fields, function(curr){
                    cur.classList.toggle('red-focus');
                } );
                document.querySelector(DOMstrings.inputBtn).classList,toggle('red');

        
            },
        
        getDOMstrings : function(){

            return DOMstrings ;
        }
    
    
    };
 
})();


// Global App Controller
var controller = (function(budgetCtrl , UICtrl){
    
    var setupEventListners = function(){
        var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress' , function(event){

        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }

});

document.querySelector(DOM.container).addEventListener('clisk', ctrlDeleteItem);


document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType );

    };
    
    var updateBudget = function(){

        // Calculate the budget
        budgetCtrl.calculateBudget;

        // Return the budget 
        var budget = budgetCtrl.getBudget();


        // Display the budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){
        
        //Calculate Percntage 
        budgetCtrl.calculatePercetages();


        // Read Percentages From Budget Contoller Module
        var percentatages = budgetCtrl.getPercentages();

        // Update the Display with new Percentages %
        UICtrl.displayPerccentages(percentatages);

    };


    var ctrlAddItem = function() {
        var input, newItem;
        
        // get input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);

            UICtrl.clearFlieds();
            updateBudget();
            updatePercentages();

        
        
        }
        
    };

    var ctrlDeleteItem =







})(budgetController , UIController);