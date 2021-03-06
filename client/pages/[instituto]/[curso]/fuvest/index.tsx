import React from 'react';
import NotasChart from '../../../../components/NotasChart';
import NotasTable from '../../../../components/NotasTable';
import Layout from '../../../../components/Layout';
import axios from '../../../../lib/axios';
import { Col, Row, Button } from 'react-bootstrap';
import { NextSeo } from 'next-seo';

const Curso = ({ data, curso, notas }) => {
  const SEO = {
    title: `MDV | ${curso.nome} - ${curso.instituto.sigla}`,
    description:
      `Notas e informações sobre o curso ${curso.nome} - ${curso.instituto.sigla} ` +
      'O Manual do Vestibulando surge da inquietação de diversas estudantes calouros durante seus anos de vestibulandas com ' +
      'a falta de informações sobre como alcançar uma vaga na Universidade de São Paulo. Em um processo tão pouco transparente, aliados ' +
      'aos Centros Acadêmicos (com destaque especial aos centrinhos politécnicos), os estudantes, em iniciativa própria, reuniram a métrica ' +
      'de desempenho dos vestibulares de ingresso (Fuvest e Enem), bem como redações e depoimentos diversos, para democratizar o acesso ' +
      'a esse tipo de informação. ' +
      'Nessa seção, é possível conhecer os cursos ofertados pela Universidade de São Paulo sob a visão de seus alunos ou Centros Acadêmicos, ' +
      'desde o foco do aprendizado até mesmo porque aquela carreira é a dos seus sonhos. Também é possível encontrar os boletins de ' +
      'desempenho referentes à cada curso, com classificação do candidato no vestibular.',

    openGraph: {
      title: `MDV | ${curso.nome} - ${curso.instituto.sigla}`,
      description:
        `Notas e informações sobre o curso ${curso.nome} - ${curso.instituto.sigla} ` +
        'O Manual do Vestibulando surge da inquietação de diversas estudantes calouros durante seus anos de vestibulandas com ' +
        'a falta de informações sobre como alcançar uma vaga na Universidade de São Paulo. Em um processo tão pouco transparente, aliados ' +
        'aos Centros Acadêmicos (com destaque especial aos centrinhos politécnicos), os estudantes, em iniciativa própria, reuniram a métrica ' +
        'de desempenho dos vestibulares de ingresso (Fuvest e Enem), bem como redações e depoimentos diversos, para democratizar o acesso ' +
        'a esse tipo de informação. ' +
        'Nessa seção, é possível conhecer os cursos ofertados pela Universidade de São Paulo sob a visão de seus alunos ou Centros Acadêmicos, ' +
        'desde o foco do aprendizado até mesmo porque aquela carreira é a dos seus sonhos. Também é possível encontrar os boletins de ' +
        'desempenho referentes à cada curso, com classificação do candidato no vestibular.',
    },
  };

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Row className="mt-4">
        <Col md={12} xl={{ span: 8, offset: 2 }}>
          <h1 className="text-center">
            {curso.nome} - {curso.instituto.sigla}
          </h1>
        </Col>
      </Row>
      <Row className="mt-2 mb-4">
        <Col xs={12} className="d-flex justify-content-center">
          {curso.texto ? (
            <Button
              size="lg"
              onClick={() => {
                location.href = curso.texto;
              }}
            >
              Acessar Texto Sobre o Curso
            </Button>
          ) : null}
        </Col>
      </Row>
      <Row className="mt-2 mb-3">
        <Col md={12} xl={{ span: 6, offset: 3 }}>
          <h1 className="text-center">
            <b>Notas</b>
          </h1>
        </Col>
      </Row>
      <div>
        <Row>
          <Col md={12} xl={{ span: 6, offset: 3 }}>
            <NotasChart notas={curso.notas} />
          </Col>
        </Row>
        <Row className="my-3">
          <Col md={12} xl={{ span: 6, offset: 3 }}>
            <NotasTable notas={curso.notas} />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({ params }) => {
  const query = `
    query Querry($curso: String!) {
      cursos(where: { slug_: $curso}) {
        nome
        instituto {
          sigla
        }
        notas(sort: "cota:asc"){
          fase1
          fase2dia1
          fase2dia2
          redacao
          classificacao
          cota
        }
        texto
      }
      notas{
        fase1
        fase2dia1
        fase2dia2
      }
    }
  `;

  const response = await axios.post('/graphql', {
    query,
    variables: {
      curso: params.curso,
    },
  });

  const data = response.data.data;
  let curso = { notas: [], instituto: { sigla: 'ERRO' } };
  if (data.cursos) {
    curso = data.cursos[0];
  }

  let notas = data.notas.filter((value) => value != null);
  curso.notas = curso.notas.filter((value) => value != null);

  curso.notas.forEach((nota) => {
    nota.total =
      ((nota.fase1 / 90) * 1000 + nota.fase2dia1 * 10 + nota.fase2dia2 * 10) /
      3;
  });
  notas.forEach((nota) => {
    nota.total =
      ((nota.fase1 / 90) * 1000 + nota.fase2dia1 * 10 + nota.fase2dia2 * 10) /
      3;
  });

  curso.notas.sort((a, b) => {
    return b.total - a.total;
  });

  curso.notas.forEach((nota) =>
    Object.keys(nota).forEach((key) => {
      try {
        nota[key] = Number(nota[key].toFixed(2));
      } catch (_) {}
    })
  );

  return {
    props: {
      curso,
      notas,
      data,
    },
  };
};

export const getStaticPaths = async () => {
  const query = `
    {
      cursos {
        slug_
        instituto {
          slug_
        }
      }
    }
  `;

  const response = await axios.post('/graphql', {
    query,
  });

  const data = response.data.data;

  return {
    paths: data.cursos.map((curso) => {
      let institutoSlug = 'outro';
      if (curso.instituto != null) {
        if (typeof curso.instituto.slug_ === 'string') {
          institutoSlug = curso.instituto.slug_;
        }
      }
      return {
        params: {
          curso: curso.slug_,
          instituto: institutoSlug,
        },
      };
    }),
    fallback: false,
  };
};

export default Curso;
