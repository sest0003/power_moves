
![Noroff](http://images.restapi.co.za/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### EP - Course Assignment Back-end

Startup code for Noroff back-end development 1 - EP course (e-commerce).

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![IMPORTANT](http://images.restapi.co.za/pvt/important_icon.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

Only your main branch will be graded.

![HELP](http://images.restapi.co.za/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---


# Installations:
- localhost is set to 3000
- To run the app you need to install the following:
npm install jsend
npm install dotenv
npm install sequelize mysql mysql2
npm install jsonwebtoken
npm install swagger-autogen swagger-ui-express
npm install --save-dev jest
npm install supertest --save-dev

# References
- Models: the structure is from the class litterature and the data is generated with ai from my ERD diagram. 

- PopulateData: the fetch api is from my semester product on this course. i just chatGTP to figure out how to fit it in my prodject 

- Raw queries in the productService: https://sequelize.org/docs/v6/core-concepts/raw-queries/

- models: the structure is from the class litterature and the data is generated with ai from my ERD diagram. 
- Email validation - https://codingjindo.medium.com/validating-email-password-with-express-validator-96cbe6984bd1

- PopulateData: the fetch api is from my semester product on this course. i just chatGTP to figure out how to fit it in my prodject 
- Raw queries: https://sequelize.org/docs/v6/core-concepts/raw-queries/

-tests - https://www.npmjs.com/package/supertest 
-https://naodeng.medium.com/supertest-tutorial-advanced-usage-common-assertions-f1b3c88a76d3
- i have used a little gpt to modify the code. 

- Swagger: I have used some gtp to modify i the code. 

- Debugging - I haved used gtp alot to debug and help me understand errors. 

# ENV
HOST = "localhost"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "P@ssw0rd"
DATABASE_NAME = "finalDatabase"
DIALECT = "mysql"
PORT = "3000"
TOKEN_SECRET = '4a6ca05a363dc20760bffa50f1ff7a01e59dbb32522d7d08d6f4bc656e973bd190a912bd47cf12e65c28fe1ea47de61cfcaf8bf2d6f7086639c60e04abdb1e56'

