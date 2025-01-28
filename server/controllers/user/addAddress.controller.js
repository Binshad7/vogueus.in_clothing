const user = require('../../models/userSchema');



const addewAddress = async (req, res) => {
  const { userId } = req.params
  console.log(req.body)
  try {

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'server side error' })
  }
}

module.exports =  {
  addewAddress
}