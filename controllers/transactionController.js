const User = require('../models/user');
const Transaction = require('../models/transaction');
const MoneyRequest = require('../models/moneyRequest')

const secretKey = 'mysecretkey';

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, secretKey);
    req.userData = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ 
      message: 'Authentication failed' 
    });
  }
};

module.exports.sendMoney = auth, async function(req, res){ 
    try { 
      const { senderId, receiverId, amount } = req.body;
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
   
      if (!sender || !receiver) {
        return res.status(400).json({
             message: 'Sender or receiver not found'
            });
      }
   
      const charges = sender.isPremium ? amount * 0.03 : amount * 0.05;
  
      const totalAmount = amount + charges;
      if (sender.wallet < totalAmount) {
        return res.status(400).json({
             message: 'Insufficient balance'
             });
      }
      sender.wallet -= totalAmount;
      receiver.wallet += amount;
  
      const transaction = new Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        charges,
        type: 'sending',
      });
  
      sender.transactions.push(transaction);
      receiver.transactions.push(transaction);
      
      await sender.save();
      await receiver.save();
      await transaction.save();
  
      const superUser = await User.findOne({ isSuperUser: true });
      superUser.wallet += charges;
      await superUser.save();
  
      res.json({ 
        message: 'Money sent successfully' 
     });
    } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Server error'
         });
    }
};

module.exports.requestMoney = auth, async function(req, res){
    try {
      const { recipientId, amount } = req.body;
      const senderId = req.user._id;
     
      const sender = await User.findById(senderId);
      const recipient = await User.findById(recipientId);
   
      if (!sender || !recipient) {
        return res.status(400).json({ message: 'Invalid sender or recipient' });
      }
  
      const senderBalance = sender.wallet.balance;
      const transactionCharges = amount * (sender.premium ? 0.03 : 0.05);
      const totalAmount = amount + transactionCharges;
      if (senderBalance < totalAmount) {
        return res.status(400).json({ 
            message: 'Insufficient balance' 
        });
      }
  
      const moneyRequest = new MoneyRequest({
        sender: senderId,
        recipient: recipientId,
        amount: amount,
        transactionCharges: transactionCharges,
        status: 'pending'
      });
  
      await moneyRequest.save();
  
      res.json({
         message: 'Money request sent successfully' 
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({
         message: 'Internal server error'
         });
    }
};

module.exports.acceptMoneyRequest = auth, async function(req, res){

    try {
      const { requestId } = req.body;
      const recipientId = req.user._id;
  
        const moneyRequest = await MoneyRequest.findById(requestId);
  
      if (!moneyRequest) {
        return res.status(400).json({ 
            message: 'Invalid money request'
         });
      }
      
      if (moneyRequest.recipient.toString() !== recipientId.toString()) {
        return res.status(400).json({
             message: 'Invalid recipient'
             });
      }

      if (moneyRequest.status !== 'pending') {
        return res.status(400).json({
            message: 'Money request has already been processed'
         });
      }
  
      const sender = await User.findById(moneyRequest.sender);
     
      if (!sender) {
        return res.status(400).json({
             message: 'Invalid sender' 
            });
      }

      const senderBalance = sender.wallet.balance;
      const transactionCharges = moneyRequest.transactionCharges;
      const totalAmount = moneyRequest.amount + transactionCharges;
      if (senderBalance < totalAmount) {
        return res.status(400).json({
             message: 'Insufficient balance'
             });
      }
  
     
      sender.wallet.balance -= totalAmount;
      sender.wallet.transactions.push({
        type: 'debit',
        amount: totalAmount,
        description: `Sent money to ${req.user.name}`
      });
      await sender.save();
  
     
      req.user.wallet.balance += moneyRequest.amount;
      req.user.wallet.transactions.push({
        type: 'credit',
        amount: moneyRequest.amount,
        description: `Received money from ${sender.name}`
      });
      await req.user.save();
  
      const superUser = await User.findOne({ role: 'superuser' });
      superUser.wallet.balance += transactionCharges;
      superUser.wallet.transactions.push({
        type: 'credit',
        amount: transactionCharges,
        description: `Transaction charges from money request sent by ${sender.name} to ${req.user.name}`
        });
        await superUser.save();
        
        moneyRequest.status = 'processed';
        await moneyRequest.save();
        
        res.json({ message: 'Money request accepted successfully' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        }
};
        
      //  app.post('/reject-money-request', auth, async (req, res) => {

module.exports.rejectMoneyRequest = auth, async function(req, res) { 
        try {
        const { requestId } = req.body;
        const recipientId = req.user._id;
        
        const moneyRequest = await MoneyRequest.findById(requestId);
        
        if (!moneyRequest) {
          return res.status(400).json({ 
            message: 'Invalid money request'
         });
        }
        
        if (moneyRequest.recipient.toString() !== recipientId.toString()) {
          return res.status(400).json({
             message: 'Invalid recipient'
             });
        }
        
        if (moneyRequest.status !== 'pending') {
          return res.status(400).json({
             message: 'Money request has already been processed' 
            });
        }
        
        moneyRequest.status = 'rejected';
        await moneyRequest.save();
        
        res.json({ 
            message: 'Money request rejected successfully'
         });
        } catch (err) {
        console.error(err);
        res.status(500).json({
             message: 'Internal server error' 
            });
        }
};