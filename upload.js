const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
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

    const headers = form.getHeaders();
    headers['Authorization'] = 'apikey ' + apiKey;

    const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/file-manager/files`, {
      method: 'POST',
      headers: headers,
      body: form
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
