import { readFileSync, readdirSync, writeFileSync } from 'fs';
import weaviate from 'weaviate-ts-client';
import readline from 'readline';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

// const schemaRes = await client.schema.getter().do();
const className = 'Meme';
const schemaConfig = {
  'class': className,
  'vectorizer': 'img2vec-neural',
  'vectorIndexType': 'hnsw',
  'moduleConfig': {
      'img2vec-neural': {
          'imageFields': [
              'image'
          ]
      }
  },
  'properties': [
      {
          'name': 'image',
          'dataType': ['blob']
      },
      {
          'name': 'text',
          'dataType': ['string']
      }
  ]
}

// Delete vectors of previously stored class
await client.schema
  .classDeleter()
  .withClassName(className)
  .do();

// Create vector data based on schema
await client.schema
  .classCreator()
  .withClass(schemaConfig)
  .do();
  
//   const img = readFileSync('./img/hi-mom.jpg');

//   const b64 = Buffer.from(img).toString('base64');
  
// await client.data.creator()
//   .withClassName('Meme')
//   .withProperties({
//     image: b64,
//     text: 'matrix meme'
//   })
//   .do();
  
/*
    Load and vectorize img files into weaviate
  */
    const imgFiles = readdirSync('./img');
    const promises = imgFiles.map(async (imgFile) => {
      const img = readFileSync(`./img/${imgFile}`);
      const b64 = Buffer.from(img).toString('base64'); 
      await client.data.creator()
        .withClassName('Meme')
        .withProperties({
          image: b64,
          text: imgFile.split('.')[0].split('_').join(' ')          
        })
        .do();
    })
    
    await Promise.all(promises);

    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    var test = null;
    rl.question('Which image to search? ', async name => {
      
      test = Buffer.from( readFileSync(`./test/${name}`) ).toString('base64');
      const resImage = await client.graphql.get()
        .withClassName('Meme')
        .withFields(['image'])
        .withNearImage({ image: test })
        .withLimit(1)
        .do();
      
      // Write result to filesystem
      const result = resImage.data.Get.Meme[0].image;
      console.log('Result Vector text: ', resImage.data.Get.Meme[0].text)
      writeFileSync('./result.jpg', result, 'base64');
      rl.close();
    });
    
