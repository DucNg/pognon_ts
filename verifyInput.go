package main

import (
	"errors"
	"strconv"

	"github.com/DucNg/pognon_ts/data"
	"github.com/go-xorm/xorm"
)

// verifyInputPognon check if user input is valid
func verifyInputPognon(db *xorm.Engine, pognon *data.PognonJSON) error {
	// Hash must be unique
	has, err := db.Get(pognon.Pognon)
	if err != nil {
		return err
	}
	if has {
		return errors.New("A pognon for this hash already exist")
	}

	// At least one participant
	if len(*pognon.Participants) <= 0 {
		return errors.New("Must have at leat one participant")
	}

	return nil
}

// verifyInputTransaction check that user input is valid
func verifyInputTransaction(db *xorm.Engine, transaction *data.Transaction) error {
	// At least one buyer
	if len(transaction.Buyers) <= 0 {
		return errors.New("You need at least one buyer")
	}
	// At least one for
	if len(transaction.For) <= 0 {
		return errors.New("You need at least one for")
	}

	// Sum buyers and for must be equal
	var totalAmountBuyers, totalAmountFor float32
	for _, purchase := range transaction.Buyers {
		totalAmountBuyers += purchase.Amount
	}
	for _, purchase := range transaction.For {
		totalAmountFor += purchase.Amount
	}
	if totalAmountBuyers != totalAmountFor {
		return errors.New("Sum buyers and for must be equals")
	}

	// Every IDPerson must exist in DB
	for _, purchase := range transaction.Buyers {
		var person = data.Person{IDPerson: purchase.IDPerson}
		has, err := db.ID(purchase.IDPerson).Get(&person)
		if err != nil {
			return err
		}
		if !has {
			return errors.New("IDPerson: " +
				strconv.FormatUint(uint64(purchase.IDPerson), 10) +
				" doesn't exist in database")
		}
	}
	for _, purchase := range transaction.For {
		var person = data.Person{IDPerson: purchase.IDPerson}
		has, err := db.ID(purchase.IDPerson).Get(&person)
		if err != nil {
			return err
		}
		if !has {
			return errors.New("IDPerson: " +
				strconv.FormatUint(uint64(purchase.IDPerson), 10) +
				" doesn't exist in database")
		}
	}

	return nil
}
