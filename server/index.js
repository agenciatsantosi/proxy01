const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const cors = require('cors');
const { PassThrough } = require('stream');

// Configura o caminho do ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Range'],
  exposedHeaders: ['Content-Length', 'Content-Range', 'Accept-Ranges']
}));

app.get('/stream', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  try {
    // Configura os headers para streaming
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Cria um stream de passthrough
    const passThrough = new PassThrough();

    // Configura o ffmpeg
    ffmpeg(url)
      .format('mp4')
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-movflags frag_keyframe+empty_moov',
        '-crf 23',
        '-preset ultrafast',
        '-tune zerolatency'
      ])
      .on('start', () => {
        console.log('Iniciando conversão:', url);
      })
      .on('error', (err) => {
        console.error('Erro na conversão:', err);
        if (!res.headersSent) {
          res.status(500).send('Erro ao processar vídeo');
        }
      })
      .on('end', () => {
        console.log('Conversão finalizada:', url);
      })
      .pipe(passThrough, { end: true });

    // Pipe o stream para a resposta
    passThrough.pipe(res);

  } catch (error) {
    console.error('Erro:', error);
    if (!res.headersSent) {
      res.status(500).send('Erro interno do servidor');
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 