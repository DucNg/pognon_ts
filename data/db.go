package data

import (
	"errors"

	"github.com/go-xorm/xorm"
)

// GetEngine get a database connection
// Create or update tables
func GetEngine(databaseFile string) (*xorm.Engine, error) {
	engine, err := xorm.NewEngine("sqlite3", databaseFile)
	if err != nil {
		return nil, err
	}

	err = engine.Sync2(new(Transaction), new(Pognon))
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
	err := engine.Find(&t, &Transaction{PognonHash: hash})
	if err != nil {
		return nil, err
	}
	if len(t) <= 0 {
		return nil, nil
	}
	return &t, nil
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
	return &PognonJSON{p, t}, nil
}

// WritePognon write a new Pognon to database
func WritePognon(engine *xorm.Engine, pognon *Pognon) error {
	_, err := engine.Insert(pognon)
	return err
}

// WriteTransaction write a transaction to database
func WriteTransaction(engine *xorm.Engine, transaction *Transaction) error {
	p := Pognon{PognonHash: transaction.PognonHash}
	has, err := engine.Get(&p)
	if err != nil {
		return err
	}
	if !has {
		return errors.New("no pognon for this hash")
	}
	_, err = engine.Insert(transaction)
	return err
}
