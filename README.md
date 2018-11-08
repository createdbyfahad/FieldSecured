# FieldSecured
###### Chrome extension to fix the autofill security vulnerability where a website can get the user's private infor with the user user knowing.
<p align="center">
  <img src="https://github.com/createdbyfahad/FieldSecured/blob/master/icons/icon128.png" width="128"/>
</p>

## Links
- Install from Google Chrome webstore: https://chrome.google.com/webstore/detail/fieldsecured-autofill-phi/faaapoieacipneimcoihjjipadkfjoeg
- Research paper assessing the vulnerability and fixes: https://github.com/createdbyfahad/FieldSecured/files/2559846/Report.pdf
- Poster summarizing my research: https://github.com/createdbyfahad/FieldSecured/files/2559849/Poster.pdf

## Development and testing
- **manifest.json** is requested by Chrome webstore and it has information about the extension
- **content_script.js** is the main file of the extension that checks the page for security flaws
- **popup.html** has a template of the popup section when the icon is clicked from Chrome bar
- **test.html** to test the extension, the html file has a form with many hidden fields and it will redirect to httpbin when submitted