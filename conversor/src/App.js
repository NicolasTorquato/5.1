import React, { useState, useEffect } from 'react';
import { fetchCurrencies } from './services/api';
import './App.css';

function App(){
  // Gerenciar dados da aplicação [cite: 889, 936]
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(true); //Estado de carregamento [cite: 945, 1069]
  const [error, setError] = useState(null); //Estado de erros

  // Buscar dados da API quando o componente é montado [cite: 942]
  useEffect(() =>{
    const loadRates = async () => {
      setLoading(true);
      setError(null);
      const currencyData = await fetchCurrencies();
      if (currencyData){
        //Add o real como base 1
        setRates({
          BRL: {buy:1},
          ...currencyData,
        });
      } else {
        setError("Não foi possível carregar as cotações. Verifique sua chave de API e a conexão.");
      }
      setLoading(false);
    };

    loadRates();
  }, []);

  // Recalcular a conversão quando o valor das moedas mudarem
  useEffect(() =>{
    if (rates[fromCurrency] && rates[toCurrency]){
      const fromRate = rates[fromCurrency].buy;
      const toRate = rates[toCurrency].buy;

      //Converte o valor pra real e depois pro destino
      const result = (amount / fromRate) * toRate;
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  //Função pra lidar com a troca de moedas
  const handleSwapCurrencies = () =>{
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (loading){
    return <div className="container"><h1>Carregando...</h1></div>; //Indicador de carregamento [cite: 1070]
  }

  if (error){
    return <div className="container error-container"><h1>Erro <p>{error}</p></h1></div>; // Exibir o erro [cite: 1064]
  }

  return (
    <div className="container">
      <h1>Conversor de Moedas</h1>
      <div className="converter-body">
        <div className="input-group">
          <label>Valor</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="input-group">
          <label>De</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            <option value="BRL">Real</option>
            <option value="USD">Dólar</option>
            <option value="EUR">Euro</option>
          </select>
        </div>

        <button className="swap-button" onClick={handleSwapCurrencies}>⇅</button>

        <div className="input-group">
          <label>Para</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            <option value="BRL">Real</option>
            <option value="USD">Dólar</option>
            <option value="EUR">Euro</option>
          </select>
        </div>
      </div>
      <div className="result">
        <h2>Resultado</h2>
        <p>{amount} {fromCurrency} = {convertedAmount} {toCurrency}</p>
      </div>
    </div>
  );
}

// teste

export default App;