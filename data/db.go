package data

import (
	"github.com/go-xorm/xorm"
)

// GetEngine get a database connection
// Create or update tables
func GetEngine() (*xorm.Engine, error) {
	engine, err := xorm.NewEngine("sqlite3", "./pognon.db")
	if err != nil {
		return nil, err
	}

	err = engine.Sync2(new(Transaction), new(Pognon))
	if err != nil {
		return nil, err
	}

	return engine, nil
}

// getPognon for a hash returns corresponding pognon
func getPognon(engine *xorm.Engine, hash string) (*Pognon, error) {
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

// idTransaction for a given pognon get the corresponding transactions
func getTransactions(engine *xorm.Engine, pognon *Pognon) (*[]Transaction, error) {
	t := []Transaction{}
	err := engine.Find(&t, &Transaction{Pognon: pognon})
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
	p, err := getPognon(engine, hash)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, nil
	}
	t, err := getTransactions(engine, p)
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
