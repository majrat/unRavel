export default {
  user_data: async (req, res) => {
    // If authenticated send user data to client

    res.status(200).json(req.user);
  },
};
