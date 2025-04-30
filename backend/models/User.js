const { Schema , model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: `/images/images.jpeg`,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    },
    booksOwned: [{ type: Schema.Types.ObjectId, ref: "Book" , default: []}],
    favouriteBooks: [{ type: Schema.Types.ObjectId, ref: "Book" , default: []}],
    bio: {
        type: String,
        maxlength: 500, 
      },

    interests: [{
        type: String,
      }],

   
}, 
{ timestamps: true}
);

userSchema.pre("save", function(next){
const user = this;

if(!user.isModified("password")) return next();

const salt = randomBytes(16).toString();
const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

this.salt = salt;
this.password = hashedPassword;
next();

});

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){

    const user = await User.findOne({email:email});

    if(!user) throw new Error("user not found");

    const salt = user.salt;
    const UserProvidedHashpassword = createHmac("sha256", salt).update(password).digest("hex");

    if(user.password !== UserProvidedHashpassword) throw new Error("Invalid password");

    const token = createTokenForUser(user);
    return {token, userId:user.id};

})

const User = model("User", userSchema);

module.exports = User;