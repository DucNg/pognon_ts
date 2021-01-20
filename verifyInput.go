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
	// Pognon must exist
	p, err := data.GetPognon(db, transaction.PognonHash)
	if err != nil {
		return err
	}
	if p == nil {
		return errors.New("No pognon for this hash")
	}

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
	var hasRest bool
	for _, purchase := range transaction.Buyers {
		totalAmountBuyers += purchase.Amount
	}
	for _, purchase := range transaction.For {
		totalAmountFor += purchase.Amount
		hasRest = hasRest || purchase.Rest
	}
	if totalAmountFor > totalAmountBuyers {
		return errors.New("Total amount for cannot exceed total amount buyers")
	}
	// If every amounts are specify sum for must equal sum buyers
	if !hasRest && totalAmountBuyers != totalAmountFor {
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

// VerifyInputDeleteTransaction check if pognon exist before deleting transaction
func verifyInputDeleteTransaction(db *xorm.Engine, hash string, IDTransaction uint16) error {
	// Pognon must exist
	p, err := data.GetPognon(db, hash)
	if err != nil {
		return err
	}
	if p == nil {
		return errors.New("No pognon for this hash")
	}

	// Transaction ID musn't be empty
	if IDTransaction == 0 {
		return errors.New("No transaction ID")
	}

	// Transaction must exist
	has, err := db.Get(&data.Transaction{IDTransaction: IDTransaction})
	if err != nil {
		return err
	}
	if !has {
		return errors.New("This transaction doesn't exist")
	}

	return nil
}

// VerifyInputDeleteTransaction check if the person is involved in transactions
// before deleting
func verifyInputDeletePerson(db *xorm.Engine, hash string, IDPerson uint16) error {
	// Pognon must exist
	p, err := data.GetPognon(db, hash)
	if err != nil {
		return err
	}
	if p == nil {
		return errors.New("No pognon for this hash")
	}

	// Person ID musn't be empty
	if IDPerson == 0 {
		return errors.New("No person ID")
	}

	// Person must exist
	has, err := db.Get(&data.Person{IDPerson: IDPerson})
	if err != nil {
		return err
	}
	if !has {
		return errors.New("This person doesn't exist")
	}

	// Person musn't be involved in transactions
	IDTransaction, err := engine.QueryString(
		`SELECT i_d_transaction
			FROM 'transaction'
			WHERE pognon_hash = ? 
			AND buyers LIKE '%' || '"IDPerson":' || ? || '%'
			OR for LIKE '%' || '"IDPerson":' || ? || '%'`,
		hash, IDPerson, IDPerson)

	if err != nil {
		return err
	}
	// If the person is involved in a transaction, we need
	// to ask the user to manually delete the person from transactions.
	if IDTransaction != nil {
		return errors.New("Cannot delete, this person is involved in transactions")
	}

	return nil
}

// verifyInputPutPerson verify that sent person is valid
func verifyInputPutPerson(db *xorm.Engine, hash string, person *data.Person) error {
	// Pognon must exist
	p, err := data.GetPognon(db, hash)
	if err != nil {
		return err
	}
	if p == nil {
		return errors.New("No pognon for this hash")
	}

	// IDPerson must be present
	if person.IDPerson == 0 {
		return errors.New("IDPerson can't be empty")
	}

	// New name must be present
	if person.Name == "" {
		return errors.New("Name can't be empty")
	}

	return nil
}
