const pool = require("../database/index")
async function updateRecords(ids,pID){
    return await pool.query("update CustomerDetails SET linkPrecedence='secondary',updatedAt=?,linkedID=? where id in (?)",[new Date(),pID,ids])
}

const identifyController = {
    getMatched:async(req,res)=>{
        try{
            const email = req.body.email;
            const phn = req.body.phoneNumber;
            const result = {
                message:'',
                contact:{
                    primaryContactId:null,
                    emails:[],
                    phoneNumbers:[],
                    secondaryContactIds:[]
                }
            }

            const MatchingCustomers = await pool.query("select * from CustomerDetails where phoneNumber=? or email=?",[phn,email])

            let OldestCustomerRecord,idsToBeUpdated=[];
        
            for(let customer of MatchingCustomers[0]){

                if(customer.linkPrecedence==='primary')
                {   
                    if(result.contact.primaryContactId !== null)
                    {
                        
                        if(OldestCustomerRecord > new Date(customer.createdAt)){
                            OldestCustomerRecord = new Date(customer.createdAt);
                            idsToBeUpdated.push(result.contact.primaryContactId);
                            result.contact.secondaryContactIds.push(result.contact.primaryContactId);
                            result.contact.primaryContactId = customer.id;
                        }
                        else{
                            idsToBeUpdated.push(customer.id);
                            result.contact.secondaryContactIds.push(customer.id);
                        }
                    }
                    else
                    {
                        result.contact.primaryContactId = customer.id;
                        OldestCustomerRecord = new Date(customer.createdAt);
                    }
                }
                else
                    result.contact.secondaryContactIds.push(customer.id);
                result.contact.emails.push(customer.email);
                result.contact.phoneNumbers.push(customer.phoneNumber);
            }
            result.message = "Identifying multiple user records with common phone number or emailID"
            
            // if one of it is missing then create a new record for it. (secondary) (linked_ID should be updated)
            // new record then create it as primary
            const emailCount = (await pool.query('select count(*) as count from CustomerDetails where email=?',[email]) )[0][0].count
            const phoneCount = (await pool.query('select count(*) as count from CustomerDetails where phoneNumber=?',[phn]) )[0][0].count
            
            if(emailCount==0 && phoneCount==0)
            {
                result.message = "No records are found, so added a new record with request's data as primary to DB"
                await pool.query('insert into CustomerDetails (phoneNumber,email,linkedId,linkPrecedence) Values (?,?,?,?)',[phn,email,null,"primary"])
            }
            else if(phoneCount==0 || emailCount==0)
            {
                result.message = "0 records are found with request's phone/email, so added a new record with request's phone/email as secondary to existing record in DB"
                await pool.query('insert into CustomerDetails (phoneNumber,email,linkedId,linkPrecedence) Values (?,?,?,?)',[phn,email,result.contact.primaryContactId,"secondary"])

            }

            // if you found the two fields are in two records with completely different values, then the one which is newest to secondary (linked_id should be updated)
            // one is not linked with other..
            else{
                if(idsToBeUpdated.length != 0)
                {    
                    result.message = "Found multiple primary Records which are not linked with one another for given request, so linked them in DB"
                    let r = await updateRecords(idsToBeUpdated,result.contact.primaryContactId)
                }
            }
            
            result.contact.phoneNumbers = [...new Set(result.contact.phoneNumbers)]
            result.contact.emails = [...new Set(result.contact.emails)]

            res.json(
                {
                    response:result
                }
            );
        }
        catch(error){
            res.json({
                error: error.message
            });
        }
        
    },
    msg:async(req,res)=>{
        try{
            res.json({message:"Hi, there please do a post call to find the list of all customers with same email/phone number"})
        }
        catch(error){
            res.json({error:error.message});
        }
    }
}

module.exports = identifyController;