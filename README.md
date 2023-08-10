# Identity-Reconciliation

* Please do a post request to `/identify` to test the below functionality (sample body of post request is provided below)
  
## Walkthrough around the functionality

#### Initial State of DB 
!["initial State"](https://drive.google.com/uc?id=178mqaemGYsolm7RX0uI7FuuBvE-8LZHD)
<br/>
<br/>
### 1. Finding all the users in the DB with the same phoneNumber/email:
##### Request
```
{
	"email": "mcfly@hillvalley.edu",
	"phoneNumber": "123456"
}
```
##### Response
!["1.initial req"](https://drive.google.com/uc?id=1jMGxqSrMHfW5fMEJqF2qeT0VrUHBogtR)

### 2. Linking two/more records that have having least one request attribute in common 
NOTE: They can be primary/secondary `linkPrecendence` attribute records
##### Request
```
{
	"email":"george@hillvalley.edu",
    "phoneNumber": "717171"
}
```
##### Response
!["1.linking the records"](https://drive.google.com/uc?id=1AwGebIv2XWcMoefq8OnN3T7goVv0hSV3)
##### State of DB after the Above Request
!["1.initial req"](https://drive.google.com/uc?id=1on1_L4pYa1rwGKeY3EN465Sh7no8qt45)
###### Observations:
* (Before performing the request) Record with `ID` 27 is linkPrecedenced with primary.
* (After performing the request) Request's attributes match records with`ID`'s 11 & 27, Oldest record is marked as primary at `linkPrecendence` (i.e. based on `createdAt`) and remaining as secondary.. since `ID` 27 is created later it's changed as secondary at `linkPrecedence`.

### 3. Adding a new Record when an email/phoneNumber attribute is unmatched with any record (i.e. no records are found) 
NOTE: Records with both attributes might not be not available in DB (then create a single unique record as primary)
##### Request
```
{
	"email":"sample@hillvalley.com",
	"phoneNumber": "678910"
}
```
##### Response
!["1.linking the records"](https://drive.google.com/uc?id=19_mc6P3uc8B7CLq0mlYZgoR0yKgerHK1)
##### State of DB after the Above Request
!["1.initial req"](https://drive.google.com/uc?id=1Rlrv6Oo5cxax5ceqx1w6QJFhpxfTnRyZ)
###### Observations:
* (After performing the request) a new record is created because there is no existing record with `email` **sample@hillvalley.com**. and record which is already present with the `phoneNumber` is linked as `primary` this new record.
<br/><br/><br/>
### NOTE: The state of DB is Set to it's original state, you can test the above functionality
## Original State
!["initial State"](https://drive.google.com/uc?id=178mqaemGYsolm7RX0uI7FuuBvE-8LZHD)
