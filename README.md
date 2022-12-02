This userscript is intented to retrieve the full CSS/Xpath path of a selected node or a provided text as argument.

## Usage : 
### By text :

    x('text in the page')

### By DOM node :
By example, open ChromeDevTools, select a node in the 'elements' tab, then in console tab, type :

    x($0)

## Sample output :
(fisrt div after body of this page)

    CSS
    body.logged-in.env-production.intent-mouse > div.position-relative.js-header-wrapper 

    XPath
    //body[@class='logged-in env-production intent-mouse']/div[@class='position-relative js-header-wrapper ']
    
## Or using specific css or Xpath expression:

    // select a node in tools/elements
    retrieveCssOrXpathSelectorFromTextOrNode($0, 'xpath')
    //body[@class='logged-in env-production intent-mouse']/div[@class='position-relative js-header-wrapper ']
