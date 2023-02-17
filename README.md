# Start API
 >>>npm start

 Server is On link http://localhost:8000

# Routes
## Auth 
### Login
    login is a Post Method active on

    [`http://localhost:8000/auth/login`]

    Post contains 

    {
        "username": "username",
        "password": "PAssw00rd"
    }

### Sign Up
    Sign up is also Post Method active on
    [`http://localhost:8000/auth/signup`]

    Post Contains
    {
        "username":"user",
        "email":"example@email.com",
        "password": "PAssw00rd",
        "first_name":"FN",
        "last_name":"LN"
    }