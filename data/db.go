package data

import (
	"github.com/go-xorm/xorm"
)

// GetEngine get a database connection
// Create or update tables
func GetEngine(databaseFile string) (*xorm.Engine, error) {
	engine, err := xorm.NewEngine("sqlite3", databaseFile)
	if err != nil {
		return nil, err
	}

	err = engine.Sync2(new(Transaction), new(Pognon), new(Person))
	if err != nil {
		return nil, err
	}

	return engine, nil
}

// GetPognon for a hash returns corresponding pognon
func GetPognon(engine *xorm.Engine, hash string) (*Pognon, error) {
	p := Pognon{PognonHash: hash}
	has, err := engine.Get(&p)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, nil
	}
	return &p, nil
}

// GetTransactions for a given pognon hash get the corresponding transactions
func GetTransactions(engine *xorm.Engine, hash string) (*[]Transaction, error) {
	t := []Transaction{}
	err := engine.OrderBy("created_at DESC").Find(&t, &Transaction{PognonHash: hash})
	if err != nil {
		return nil, err
	}
	if len(t) <= 0 {
		return nil, nil
	}
	return &t, nil
}

// GetParticipants given a pognon hash return list of participants
func GetParticipants(engine *xorm.Engine, hash string) (*[]Person, error) {
	par := []Person{}
	err := engine.Where("pognon_hash = ?", hash).Find(&par)
	if err != nil {
		return nil, err
	}
	if len(par) <= 0 {
		return nil, nil
	}
	return &par, nil
}

// GetPognonJSON given a hash build a JSON response with corresponding pognon
func GetPognonJSON(engine *xorm.Engine, hash string) (*PognonJSON, error) {
	p, err := GetPognon(engine, hash)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, nil
	}
	t, err := GetTransactions(engine, hash)
	if err != nil {
		return nil, err
	}
	par, err := GetParticipants(engine, hash)
	if err != nil {
		return nil, err
	}
	return &PognonJSON{p, par, t}, nil
}

// WritePognon write a new Pognon to database
func WritePognon(engine *xorm.Engine, pognon *PognonJSON) error {
	var participants []Person
	for _, person := range *pognon.Participants {
		participants = append(participants, Person{
			Name:       person.Name,
			PognonHash: pognon.Pognon.PognonHash,
		})
	}

	_, err := engine.Insert(&participants)
	if err != nil {
		return err
	}

	_, err = engine.Insert(pognon.Pognon)
	if err != nil {
		return err
	}

	return err
}

// WriteTransaction write a transaction to database
func WriteTransaction(engine *xorm.Engine, transaction *Transaction) error {
	_, err := engine.Insert(transaction)
	return err
}

// DeleteTransaction delete a transaction from database
func DeleteTransaction(engine *xorm.Engine, IDTransaction uint16) error {
	_, err := engine.Delete(&Transaction{IDTransaction: IDTransaction})
	return err
}

// DeletePerson delete a person from database
// Before deleting we need to check if the person is involved in any
// transaction. Otherwise all debt will be wrong.
func DeletePerson(engine *xorm.Engine, IDPerson uint16) error {
	// If everyhing is fine we delete the person
	_, err := engine.Delete(&Person{IDPerson: IDPerson})
	return err
}

// PutPerson perform update for a person.
// In practice it means changing it's name.
func PutPerson(engine *xorm.Engine, person *Person) error {
	_, err := engine.ID(person.IDPerson).Update(person)
	return err
}
