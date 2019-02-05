// Fonctions
// Fonction pour vérifier l'égalité entre 2 tableaux simples
function equalityTable(table1, table2){
	if (table1.length != table2.length) {
		return false;
    }
    else {
        for (var i = 0; i < table1.length; i++) {
            if (table1[i] != table2[i]) {
                return false;
            }
        }
    };
    return true;
}