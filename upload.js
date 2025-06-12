const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { apiKey, dc, name, file } = req.body;

    if (!apiKey || !dc || !name || !file) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const buffer = Buffer.from(file.split(',')[1], 'base64');
    const form = new FormData();
    form.append('file_data', buffer, name);
    form.append('name', name);

    const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/file-manager/files`, {
      method: 'POST',
      headers: {
        'Authorization': 'apikey ' + apiKey,
        ...form.getHeaders()
      },
      body: form
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
