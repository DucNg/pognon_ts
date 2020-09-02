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
