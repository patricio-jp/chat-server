const User = require('../models/user.model');

exports.getUsers = async (req, res) => {
  const users = await User.find();
  if (users.length === 0) return res.status(404).json([]);

  // No devolver password de los usuarios
  users.forEach((user) => {
    user.password = undefined;
  })

  return res.json(users);
}

exports.addContact = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "El id del usuario que quiere agregar como contacto es necesario" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "No existe el usuario que realiza la petición" });

  const newContact = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "No existe el usuario que se desea agregar como contacto" });

  try {
    user.contacts.push(newContact);
    await user.save();
    return res.json({ message: "Contacto agregado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}

exports.deleteContact = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "El id del usuario que quiere eliminar como contacto es necesario" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "No existe el usuario que realiza la petición" });

  try {
    user.contacts = user.contacts.filter(contactId => contactId._id.toString() !== userId);
    await user.save();
    return res.json({ message: "Contacto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
