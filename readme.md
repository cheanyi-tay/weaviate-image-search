**Vector reverse image search**
Node application using Weaviate Database Docker Compose
Type `node index.js` in the console to start

Source images: `./img`
To query images: `./test`

Search result: `result.jpg`

**Pre-requisites**
- Node
- Weaviate Docker
Get Weaviate docker from weaviate's official website: https://weaviate.io/developers/weaviate/installation/docker-compose

As of 1/5/2023, using:
- v1.18.4
- with modules
- image
- pytorch-resnet50
- ref2vec disabled
- openai disabled
- docker compose


**To Use**
1. Upload image into `./img` folder as a search database
2. Upload image into `./test` folder as image to query for ease of use
3. Run `node index.js` in console to start application and search"# weaviate-image-search" 
