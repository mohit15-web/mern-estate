

export const createUser = async (req, res) => {
    const newUser = new userModel(req.body);
    const user = await newUser.save();
    res.send(user);
}