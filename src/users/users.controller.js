exports.profile = async (req, res) => {
    res.send(req.user);

}