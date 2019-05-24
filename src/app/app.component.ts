import { Component, OnInit } from '@angular/core';
import { FireSQL } from 'firesql';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  fireSQL;

  constructor() {
    let firebaseConfig = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    };

    firebase.initializeApp(firebaseConfig);
    this.fireSQL = new FireSQL(firebase.firestore());
  }

  ngOnInit(): void {
    this.consultaEstatistica()
  }

  consultaComWhere() {
    const cidades = this.fireSQL.query(`
        SELECT  nome as cidade, uf, populacao
        FROM cidades
        Where uf = 'PR' and populacao > 10000
      `);

    cidades.then(lista => {
      for (let cidade of lista) {
        console.log(`${cidade.cidade} -  UF: ${cidade.uf} - População: ${cidade.populacao}`)
      }
    })
  }

  consultaComLike() {
    const estados = this.fireSQL.query(`
        SELECT  *
        FROM estados
        Where nome like 'P%'
      `);

    estados.then(lista => {
      for (let uf of lista) {
        console.log(`${uf.nome} -  UF: ${uf.sigla} `)
      }
    })
  }

  consultaComIN() {
    const cidades = this.fireSQL.query(`
        SELECT  nome as cidade, uf, populacao
        FROM cidades
        Where uf IN ('PR', 'SP')
       `);

    cidades.then(lista => {
      for (let cidade of lista) {
        console.log(`${cidade.cidade} -  UF: ${cidade.uf} - População: ${cidade.populacao}`)
      }
    })
  }

  consultaComOrderBy() {
    const cidades = this.fireSQL.query(`
        SELECT  nome, uf, populacao
        FROM cidades
        order by nome
       `);

    cidades.then(lista => {
      for (let cidade of lista) {
        console.log(`${cidade.nome} -  UF: ${cidade.uf} - População: ${cidade.populacao}`)
      }
    })
  }


  consultaComLimit() {
    const cidades = this.fireSQL.query(`
          SELECT  nome as cidade, uf, populacao
          FROM cidades
          limit 3
        `);

    cidades.then(lista => {
      for (let cidade of lista) {
        console.log(`${cidade.cidade} -  UF: ${cidade.uf} - População: ${cidade.populacao}`)
      }
    })
  }

  consultaComObjetoAninhado() {
    const pessoas = this.fireSQL.query(`
          SELECT  nome, endereco FROM pessoas
          WHERE \`endereco.bairro\` = 'Centro'
        `);

    pessoas.then(lista => {
      console.log(lista)
      for (let pessoa of lista) {
        console.log(`${pessoa.nome} - Endereco: ${pessoa.endereco.rua} Bairro: ${pessoa.endereco.bairro} `)
      }
    })
  }

  consultaArrays() {
    const pessoas = this.fireSQL.query(`
          SELECT  nome, endereco, tags FROM pessoas
          WHERE tags CONTAINS 'saúde'

        `);

    pessoas.then(lista => {
      console.log(lista)
      for (let pessoa of lista) {
        console.log(`${pessoa.nome} - Interesses: ${JSON.stringify(pessoa.tags)}`)
      }
    })
  }

  consultaEstatistica() {
    const estatistica = this.fireSQL.query(`
    SELECT MIN(idade) as minimo, AVG(idade) as media, MAX(idade) as maximo
    FROM pessoas`);
    estatistica.then(lista => {
      console.log(lista)
      for (let estatistica of lista) {
        console.log(`Mínimo: ${estatistica.minimo} - Máximo: ${estatistica.maximo} - Média: ${estatistica.media}`)
      }
    })
  }

}
