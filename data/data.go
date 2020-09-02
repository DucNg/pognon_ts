package data

import (
	"time"

	_ "github.com/go-xorm/xorm" // WIP
	_ "github.com/mattn/go-sqlite3"
)

// Purchase is an amount payed by someone or an amount used by someone
type Purchase struct {
	Person string
	Amount float32
}

// Transaction is a money transaction for a Pognon
type Transaction struct {
	IDTransaction uint16     `xorm:"pk SERIAL"`
	Pognon        *Pognon    `xorm:"INTEGER NOT NULL INDEX" json:"-"` // Reference to a pognon
	Buyers        []Purchase // The ones who payed and how much
	For           []Purchase // The ones who used the money and how much
	Reason        string     // What was payed

	CreatedAt time.Time `xorm:"created"`
	UpdatedAt time.Time `xorm:"updated"`
}

// Pognon is a list of transactions and participants
type Pognon struct {
	IDPognon     uint16 `xorm:"pk SERIAL"`
	PognonHash   string `xorm:"unique index"` // Random hash to identify pognon
	Participants []string
}

// PognonJSON is a structured response to a pongon request
type PognonJSON struct {
	Pognon       *Pognon
	Transactions *[]Transaction
}
