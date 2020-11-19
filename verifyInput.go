package main

import (
	"errors"
	"strconv"

	"github.com/DucNg/pognon_ts/data"
	"github.com/go-xorm/xorm"
)

// verifyInputPognon check if user input is valid
func verifyInputPognon(db *xorm.Engine, pognon *data.PognonJSON) error {
	// Hash musn't be empty
	if pognon.Pognon.PognonHash == "" {
		return errors.New("PognonHash can't be empty")
	}

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

	// Total amount for cannot exceed total amount buyers
	var totalAmountBuyers, totalAmountFor float32
	var doesHaveRest bool
	for _, purchase := range transaction.Buyers {
		totalAmountBuyers += purchase.Amount
	}
	for _, purchase := range transaction.For {
		totalAmountFor += purchase.Amount
		doesHaveRest = doesHaveRest || purchase.Rest
	}
	if totalAmountFor > totalAmountBuyers {
		return errors.New("Total amount for cannot exceed total amount buyers")
	}
	// If every amounts are specify sum for must equal sum buyers
	if !doesHaveRest && totalAmountBuyers != totalAmountFor {
		return errors.New("Total amount for cannot exceed total amount buyers")
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
