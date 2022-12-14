import { useContext } from 'react';
import { Rings } from 'react-loader-spinner';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import WalletContext from '../WalletContext.js';

export default function Records({ wallet, error, loading, setRefresh, handleDelete }) {

  const navigate = useNavigate();
  const { setEdit, setEntry, setEntryType } = useContext(WalletContext);

  let noEntries = false;

  function calculateBalance(entries) {
    let balance = 0;
    entries.forEach(entry => {
      if (entry.type === 'in')
        balance += Number(entry.value);
      else
        balance -= Number(entry.value);
    });
    return balance;
  }

  const balance = calculateBalance(wallet);

  if (wallet.length === 0) {
    noEntries = true;
    if (loading) {
      return (
        <RecordsComponent noEntries={noEntries}>
          Um momento...
          <Rings
            height='100'
            width='100'
            color='#7202F7'
            radius='10'
          />
        </RecordsComponent>
      );
    } else if (error) {
      return (
        <RecordsComponent noEntries={noEntries}>
          Um erro ocorreu!
          Não foi possível carregar os dados da sua carteira!
          Verifique a sua conexão e tente novamente!
        </RecordsComponent>
      );
    } else {
      return (
        <RecordsComponent noEntries={noEntries}>
          Não há registros de entrada ou saída!
        </RecordsComponent>
      );
    }
  }

  return (
    <RecordsComponent noEntries={noEntries}>
      <Entries>
        {wallet.map(entry =>
          <EntryComponent key={entry.id}>
            <Entry
              title={`Editar ${entry.type === 'in' ? 'entrada' : 'saída'}`}
              onClick={() => {
                setEdit(true);
                setEntry(entry);
                setEntryType(entry.type);
                navigate('/entry');
              }}
            >
              <DateEntry>{entry.date}</DateEntry>
              <div>
                <Description>{entry.description}</Description>
                <Value type={entry.type}>{
                  Number(entry.value)
                    .toLocaleString(
                      'pt-BR',
                      { style: 'currency', currency: 'BRL' },
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                </Value>
              </div>
            </Entry>
            <DeleteButton
              title={`Excluir ${entry.type === 'in' ? 'entrada' : 'saída'}`}
              onClick={() => {
                handleDelete(entry.id, entry.description);
                setRefresh(Math.random());
              }}
            >
              <IoClose />
            </DeleteButton>
          </EntryComponent>
        )}
      </Entries>
      <div>
        <Balance>
          <span>SALDO</span>
          <Total positive={(balance > 0) ? true : false}>{
            Math.abs(balance).toLocaleString(
              'pt-BR',
              { style: 'currency', currency: 'BRL' },
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}
          </Total>
        </Balance>
      </div>
    </RecordsComponent>
  );
}

const RecordsComponent = styled.section`
  width: 100%;
  height: -moz-calc(100% - 150px);
  height: -webkit-calc(100% - 150px);
  height: calc(100% - 150px);
  max-width: 330px;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.noEntries ? 'center' : 'space-between'};
  align-items: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #868686;
  margin: 13px 0px;
  padding: 23px 12px 10px 12px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, .85);
  border-radius: 5px;

  div {
    width: 100%;
    height: 25px;
    display: ${props => props.noEntries ? 'flex' : 'block'};
    justify-content: center;
  }
`;

const Entries = styled.section`
  width: 100%;
  display: ${props => props.noEntries ? 'flex' : 'block'};
  justify-content: center;
  overflow-y: auto;
  margin-bottom: 15px;
`;

const EntryComponent = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Entry = styled.button`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  background-color: transparent;
  margin: 8px 5px 8px 0px;
  padding: 0px;
  box-sizing: border-box;
  border: none;
  outline: none;
  cursor: pointer;

  div {
    height: auto;
    min-height: 25px;
    width: 100%;
    display: flex;
    padding: 0px 3px 0px 7px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
  }
`;

const DeleteButton = styled.button`
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
      width: 15px;
      height: 15px;
      color: #969696;
    }
`;

const DateEntry = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #969696;
`;

const Description = styled.span`
  height: auto;
  padding: 0px 4px;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  word-break: break-word;
`;

const Value = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: ${props => props.type === 'in' ? '#03AC00' : '#C70000'};
`;

const Balance = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 3px;
  box-sizing: border-box;

  span {
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;
    color: #000000;
  }
`;

const Total = styled.h1`
  font-weight: 400;
  color: ${props => props.positive ? '#03AC00' : '#C70000'};
`;