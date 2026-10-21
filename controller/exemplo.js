// use db_filmes_20261_a;

// show tables;

// select * from tbl_filme  where id = 33;
// select * from tbl_classificacao;
// select * from tbl_genero;

// ### Selecionar atributos de diferentes tabelas ###
// select tbl_filme.nome, tbl_filme.data_lancamento, tbl_filme.sinopse, tbl_classificacao.tipo_classificacao
// 	from tbl_filme
// 		#Junto com
// 		inner join tbl_classificacao
// 			#Onde tbl_classificacao.id é uma FK de tbl_filme.id_classificacao
// 			on tbl_classificacao.id = tbl_filme.id_classificacao;
            
// #Comando LEFT JOIN
// select 	tbl_filme.nome, tbl_filme.data_lancamento, tbl_filme.sinopse, 
// 		tbl_classificacao.tipo_classificacao
// from tbl_classificacao
// 	#junto a esquerda
// 	left join tbl_filme
// 		#Onde tbl_classificacao.id é uma FK de tbl_filme.id_classificacao
// 		on tbl_classificacao.id = tbl_filme.id_classificacao;
            
// #Comando RIGHT JOIN
// select 	tbl_filme.nome, tbl_filme.data_lancamento, tbl_filme.sinopse, 
// 		tbl_classificacao.tipo_classificacao
// from tbl_filme
// 	#junto a direita
// 	right join tbl_classificacao
// 		#Onde tbl_classificacao.id é uma FK de tbl_filme.id_classificacao
// 		on tbl_classificacao.id = tbl_filme.id_classificacao;
            
// ### Diferença entre ambos ###
// #	O comando inner retorna somente objetos que estão relacionados entre as tabelas, caso a tbl_filme tenha um objeto (filme) que não possua uma classificação (campo obrigatório), 
// #o mesmo não irá aparecer no resultado final, pois não está relacionado, lembre-se do diagrama de sobreposição de nichos.

// #	O comando left retorna todos os objetos pertencentes a tabela da esquerda existente, mesmo que o objeto não esteja relacionado a tbl_classificacao, não é muito utilizado,
// #mas em certos casos, como um relatório em uma área gerencial da empresa, é necessário retornar todos os dados, é mais utilizado em ocasiões específicas.
// #Existe o comando "right join", o conceito é o mesmo que o "left join", o mySQL não possuia o right join.


// insert into tbl_filme_genero (id_filme,id_genero)
// 	values	(34,1),
// 			(35,2),
//             (36,3),
//             (37,4),
//             (38,5);
            
// select 	tbl_filme.nome as nome_filme, tbl_filme.sinopse, tbl_filme.duracao,
// 		tbl_classificacao.tipo_classificacao, tbl_classificacao.descricao,
//         tbl_genero.nome as nome_genero
        
// from 	tbl_filme
// 	inner join tbl_classificacao
// 		on tbl_classificacao.id = tbl_filme.id_classificacao
// 	left join tbl_filme_genero
// 		#Onde o id do filme virou uma estrangeria na tbl_filme_genero, cujo o nome é id_filme
// 		on tbl_filme.id	= tbl_filme_genero.id_filme
// 	left join tbl_genero
// 		#Onde o id do gênero virou uma estrangeria na tbl_filme_genero, cujo o nome é id_genero
// 		on tbl_genero.id = tbl_filme_genero.id_genero
// 	order by tbl_filme.nome asc;
    
//     select * from tbl_filme_genero;
//     select * from tbl_filme;
			
// ### SUBCONSULTA ###

// select * from tbl_filme_genero where id_filme in (
// 													select tbl_filme.id from tbl_filme
//                                                 );