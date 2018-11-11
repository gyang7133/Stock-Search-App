//Create stocksList array that list stock symnbols that interests me
const stocksList = [
    {
        symbol: 'GE',
        name: 'General Electric'
    },
    {
        symbol: 'AAPL',
        name: 'Apple'
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft'
    },
    {
        symbol: 'SBUX',
        name: 'Starbucks'
    },
    {
        symbol: 'AMZN',
        name: 'Amazon'
    },
    {
        symbol: 'GOOGL',
        name: 'Google'
    },
    {
        symbol: 'FB',
        name: 'Facebook'
    },
    {
        symbol: 'IBM',
        name: 'IBM'
    },
   
]

const validationList = [];

// 1. Take the stocks in array and create buttons in your HTML. render the stock information on the page.
const renderStockInfo = function()
{
    // 2. When the user clicks on a button, the page should grab the user company name, logo, price and up to 10 articles related to stock 
   //     from the iexTrading API and render the on the page


    const stock = $(this).attr('data-name');
    const queryURL =  `https://api.iextrading.com/1.0/stock/${stock}/batch?types=company,logo,quote,news&range=1m&last=10`;

    //AJAX Call. thenn after recieving a response, displays the text on the page

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response){

        $('#stocks-info').empty();
        // Creating the div clas to hold the stock information and article for each company
            const stockDiv = $('<div>').addClass('stock');
            const logoDiv = $('#stocks-logo').addClass('stock-logo');
    
            //Storing the company logo 
             const logo = response.logo.url;
            // Storing the company name
            const compName = response.quote.companyName;
            //Storing Company CEO
            const compCEO = response.company.CEO;
            //Storing  Description
            const description = response.company.description;
            // Storing the stock symbol
            const stockSymbol = response.quote.symbol;
            // Storing the price
            const stockPrice = response.quote.latestPrice;
            // Storing the first news summary
            const stockNews = response.news;
            
            //Rendering the company name on the HTML

            $('#company-name').empty();
            $('#company-name').append(`${compName}`);

            $('#stocks-info').prepend(
                `
                <div class="row">
                <div class="col-sm-3">
                    <img src="${logo}" alt="Card image">
                </div>
                <br>
                <div class="col-sm-9">
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item">Company Description: ${description}</li>
                    <li class="list-group-item">Company CEO: ${compCEO}</li>
                    <li class="list-group-item">Stock Symbol: ${stockSymbol}</li>
                    <li class="list-group-item"> Stock Price: $${stockPrice}</li>
                    </ul>
                </div>
                </div>
                `);

            // Append and loop through the 10 News Articles related to each stock company
            for (let i = 0; i < stockNews.length; i++) 
            {
                $('#stocks-info').append(
                `
                <div class="card my-3">
                <h5 class="card-header">Article ${i + 1}: ${stockNews[i].headline}</h5>
                <div class="card-body">
                    <!-- articles get populated here -->
                    <p class="card-text">${stockNews[i].summary}</p>
                </div>
                <div class="card-footer">
                <!-- article url population -->
                <a href="${stockNews[i].url}" class="card-link" target="_blank">Link to Article</a>
                </div>
                </div>
                `);
             }

});
                
}

// 3. Make a separate iexTrading API call that will retureive all stick symbols available in iexTrading and stire it into an array called validationList

$.get('https://api.iextrading.com/1.0/ref-data/symbols', function(response)
{
    response.forEach(e => {
        validationList.push({
            'symbol' : e.symbol.toUpperCase(), //Capitialize stock symbols
            'name' : e.name

        });
    });
});

// 4. Add a form to your page that takes the value from user input box and add it into your stockList array only if the input exists in our validationList.
//   Need to make sure user input is always Capitalized. Then make a function call that takes each topic in the array remakes the buttons on the page.

// Display stockList array data 

const renderStockList = function() 
{
    //Clearing the stocks before new stocks are added
    $('#stocks-btn-list').empty();

    //Looping through the array of stocks
    
    for(let i  = 0; i < stocksList.length; i++)
    {
        // Then dynamically generating buttons for each stock in the array
    // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
        let newButton = $('<button class="btn-block btn btn-secondary p-1 m-1">');

        // Adding a class of stock to our button
        newButton.addClass('stock-btn');
    
        // Adding a data-attribute
        newButton.attr('data-name', stocksList[i].symbol);
    
        // Providing the initial button text
        newButton.text(stocksList[i].symbol);
    
        // Adding the button to the buttons-view div
        $('#stocks-btn-list').append(newButton);
    }

}

    // This function handles events where one button is clicked
    const addButton = function(event) 
    {

        // event.preventDefault() prevents the form from trying to submit itself.
        // We're using a form so that the user can hit enter instead of clicking the button if they want
        event.preventDefault();
    
        // This line will grab the text from the input box
        let userInput = $('#symbol-input').val().toUpperCase();
        
        // The stock from the textbox is then added to our array
        validationList.forEach(e =>
        {
            if(userInput === e.symbol)
            {
                stocksList.push(
                {
                    symbol : e.symbol,
                    name : e.name
                });

                renderStockInfo();
                alert('Adding ' + e.name + 'to the Company Stock List.')
            } 
            
        });
      
    
        // Deletes the contents of the former input
        $('#symbol-input').val('');
    
        // calling render which handles the processing of our stock array
        renderStockList();
    }
    

      // Function to empty out the articles
    const clear = function () 
    {
        $('#symbol-input').val('');
    }

    //Event Listener for the Add Button
    $('#add-stock').on('click', addButton);
    
    // Function for displaying the stock info
    // Using $(document).on instead of $('.stock').on to add event listeners to dynamically generated elements
    $('#stocks-btn-list').on('click', '.stock-btn', renderStockInfo);

    //  .on('click') function associated with the clear button
     $('#clear-all').on('click', clear);

    
    // Calling the renderButtons function to display the initial buttons
    renderStockList();