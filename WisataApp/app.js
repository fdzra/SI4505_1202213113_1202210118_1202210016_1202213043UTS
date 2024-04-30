const express = require('express')
const app = express()

const mysql = require('mysql');

// Buat koneksi ke database MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pariwisata'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Terhubung ke database MySQL');
    
});

// Endpoint dengan metode GET
app.get('/tempat/:id_tempat', (req, res) => {
    const id_tempat = req.params.id_tempat;
    // Jalankan query SQL untuk mengambil data dari tabel tempat
    connection.query('SELECT * FROM tempat WHERE id_tempat = ?', [id_tempat], (error, results, fields) => {
        if (error) {
            console.error('Error saat menjalankan query:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data dari server' });
            return;
        }
        // Kirim data sebagai respons
        res.json(results);
    });
});

app.post('/tempat/add', (req, res) => {
    const { nama_tempat, deskripsi, lokasi } = req.body;

    // Pastikan nama dan lokasi tersedia dalam body permintaan
    if (!nama_tempat || !deskripsi || !lokasi) {
        res.status(400).json({ error: 'Nama dan lokasi harus diisi' });
        return;
    }

    // Jalankan query SQL untuk memasukkan data baru ke tabel tempat
    connection.query('INSERT INTO tempat (nama_tempat, deskripsi, lokasi) VALUES (?, ?, ?)', [nama_tempat, deskripsi, lokasi], (error, results, fields) => {
        if (error) {
            console.error('Error saat menjalankan query:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan data ke server' });
            return;
        }
        // Kirim respons bahwa data berhasil ditambahkan
        res.status(201).json({ message: 'Data berhasil ditambahkan' });
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
