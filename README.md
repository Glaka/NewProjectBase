What this gulp can do : 
- compile scss/sass to one css , add prefixes , expand short input by postcss short
- bundle js from modules to one bundled js file , minimize to production stage 
- lint php , minimize to production
- build sprite image prof icons ( one default version and one sprite for retina displays that automaticaly uses by media rule in generated sprite.css )
- minimize images to production stage
- transoprts vendor files from src to dev/ and prod/ witout no need to touch this folders manualy 
- build html from parts and minify to prod stage
------------------------------
Install NPM packages :
`npm i` 

In gulpfile configurate variable `config` accordinly to a preferable build methods 

To stard development run in terminal command :
`gulp`

to build production version run: 
`gulp prod`

All development are ment to be done in `src folder` , no need to do manipulations in dev or prod 

Default dev urls : http://localhost:9451


------------------------------

install new package for development :
npm i *package-name* --save-dev

install new plugin or lib : 
npm i *package-name* --save-dep

------------------------------
Sprite instruction :
source sprite images should be in 'src/img/sprite' directory 

For retina support should be 2 versions of image , for examlpe : 
'example.png' and 'example@2x.png' for retina display. 

to use sprite in development in html add class .icon-example or in scss @export .icon-example

------------------------------

