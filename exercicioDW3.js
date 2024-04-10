const express = require('express');
const app = express();
const port = 3000;

let alunos = [];

app.use(express.json());

app.post('/alunos', (req, res) => {
    const { RA, nome, turma } = req.body;
    const aluno = { RA, nome, turma, cursos: [] };
    alunos.push(aluno);
    res.json(aluno);
});

app.post('/alunos/:RA/cursos', (req, res) => {
    const RA = req.params.RA;
    const { curso } = req.body;
    const aluno = alunos.find(aluno => aluno.RA === RA);
    if (aluno) {
        aluno.cursos.push(curso);
        res.json(aluno);
    } else {
        res.status(404).json({ error: 'Aluno não encontrado.' });
    }
});

app.put('/alunos/:RA', (req, res) => {
    const RA = req.params.RA;
    const { nome, turma } = req.body;
    const aluno = alunos.find(aluno => aluno.RA === RA);
    if (aluno) {
        aluno.nome = nome;
        aluno.turma = turma;
        res.json(aluno);
    } else {
        res.status(404).json({ error: 'Aluno não encontrado.' });
    }
});


app.put('/alunos/:RA/cursos/:curso', (req, res) => {
    const RA = req.params.RA;
    const cursoAntigo = req.params.curso;
    const novoCurso = req.body.curso;
    const aluno = alunos.find(aluno => aluno.RA === RA);
    if (aluno) {
        const index = aluno.cursos.indexOf(cursoAntigo);
        if (index !== -1) {
            aluno.cursos[index] = novoCurso;
            res.json(aluno);
        } else {
            res.status(404).json({ error: 'Curso não encontrado para este aluno.' });
        }
    } else {
        res.status(404).json({ error: 'Aluno não encontrado.' });
    }
});


app.delete('/alunos/:RA', (req, res) => {
    const RA = req.params.RA;
    alunos = alunos.filter(aluno => aluno.RA !== RA);
    res.json({ message: 'Aluno removido com sucesso.' });
});


app.delete('/alunos/:RA/cursos/:curso', (req, res) => {
    const RA = req.params.RA;
    const curso = req.params.curso;
    const aluno = alunos.find(aluno => aluno.RA === RA);
    if (aluno) {
        aluno.cursos = aluno.cursos.filter(c => c !== curso);
        res.json(aluno);
    } else {
        res.status(404).json({ error: 'Aluno não encontrado.' });
    }
});


app.get('/alunos', (req, res) => {
    res.json(alunos.map(({ RA, nome, turma }) => ({ RA, nome, turma })));
});


app.get('/alunos/:RA', (req, res) => {
    const RA = req.params.RA;
    const aluno = alunos.find(aluno => aluno.RA === RA);
    if (aluno) {
        res.json({ nome: aluno.nome, turma: aluno.turma, cursos: aluno.cursos });
    } else {
        res.status(404).json({ error: 'Aluno não encontrado.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
