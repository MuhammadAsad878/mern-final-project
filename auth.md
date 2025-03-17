 **Authentication**
 is to authenticate user like signup and login to check whether user is registered or not

 **Authorization** is the process of verifiying what specific applications, files, and data a user has access to
 like post edit, delete comment, delete post etc. A review is only deleted by its creator only

 **Storing Passwords**
 we never store the passwords as it it. We store their hashded form so that if it leaks then the unauthorized person even if he had passwords does't able to view it as hashing causes passwords to be irreversible to decrypt 
 **e.g**
 password = "helloworld"
 hashedForm = "983jjdsf983nkdsf8723n4sdf9832nfjso03f9832nfjso03nkdsf87"

 **Hashing**
// In hashing we convert password to hash form which is impossible to retrieve and whenever user login or change password then user entered password will also be converted to hash password using hasing function if both user entered and user stored password in database are equal then authentication successfull
// Hasing output remains same for same input
**Hashing Characteristics**
1. For every input, there is a fixed output
2. They are one-way function as we can only convert simple   password to hash form  
3. For a different input, there is different output but of same length
4. Small changes in input should bring large change in output
5. For every input, there is a fixed output