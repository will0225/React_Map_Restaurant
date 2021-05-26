// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default (req, res) => {
  axios.get('https://s3.amazonaws.com/br-codingexams/restaurants.json')
  .then(async data => {
    console.log(data);
    res.status(200).json({ data: await data.data })
  }).catch(error => {
    res.status(200).json({ data: error })
  })
}
