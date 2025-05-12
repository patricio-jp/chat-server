const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Usuario ya registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });
    // Marcar como undefined password para enviar el usuario
    user.password = undefined;
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
