import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IClientes } from '../interfaces/clientes.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly mockData: IClientes[] = [
    { id: '1', fullName: 'Ana Carolina Silva', phone: '11987654321', cpf: '12345678901', cep: '01001000' },
    { id: '2', fullName: 'Bruno Henrique Oliveira', phone: '21976543210', cpf: '23456789012', cep: '20040002' },
    { id: '3', fullName: 'Carla Fernanda Souza', phone: '31965432109', cpf: '34567890123', cep: '30140090' },
    { id: '4', fullName: 'Daniel Costa Pereira', phone: '41954321098', cpf: '45678901234', cep: '80010000' },
    { id: '5', fullName: 'Eduarda Lima Rocha', phone: '51943210987', cpf: '56789012345', cep: '50010010' },
    { id: '6', fullName: 'Felipe Augusto Mendes', phone: '61932109876', cpf: '67890123456', cep: '70040010' },
    { id: '7', fullName: 'Gabriela Martins Torres', phone: '71921098765', cpf: '78901234567', cep: '40010010' },
    { id: '8', fullName: 'Henrique Almeida Barros', phone: '81910987654', cpf: '89012345678', cep: '60010010' },
    { id: '9', fullName: 'Isabela Cristina Ribeiro', phone: '91909876543', cpf: '90123456789', cep: '90010010' },
    { id: '10', fullName: 'João Pedro Ferreira', phone: '11998765432', cpf: '01234567890', cep: '01002000' },
    { id: '11', fullName: 'Karina Santos Neves', phone: '21987654321', cpf: '11234567890', cep: '20050002' },
    { id: '12', fullName: 'Lucas Gabriel Azevedo', phone: '31976543210', cpf: '22345678901', cep: '30150090' },
    { id: '13', fullName: 'Mariana Beatriz Dias', phone: '41965432109', cpf: '33456789012', cep: '80020000' },
    { id: '14', fullName: 'Nicolas Eduardo Cunha', phone: '51954321098', cpf: '44567890123', cep: '50020010' },
    { id: '15', fullName: 'Olivia Helena Pinto', phone: '61943210987', cpf: '55678901234', cep: '70050010' },
    { id: '16', fullName: 'Paulo Ricardo Farias', phone: '71932109876', cpf: '66789012345', cep: '40020010' },
    { id: '17', fullName: 'Quiteria dos Anjos', phone: '81921098765', cpf: '77890123456', cep: '60020010' },
    { id: '18', fullName: 'Rafael Moreira Teixeira', phone: '91910987654', cpf: '88901234567', cep: '90020010' },
    { id: '19', fullName: 'Sofia Larissa Campos', phone: '11900987654', cpf: '99012345678', cep: '01003000' },
    { id: '20', fullName: 'Thiago André Leite', phone: '21999876543', cpf: '10123456789', cep: '20060002' },
    { id: '21', fullName: 'Ursula Conceição Moraes', phone: '31988765432', cpf: '21123456790', cep: '30160090' },
    { id: '22', fullName: 'Vinicius dos Reis', phone: '41977654321', cpf: '32123456701', cep: '80030000' },
    { id: '23', fullName: 'Wagner Luiz Braga', phone: '51966543210', cpf: '43123456712', cep: '50030010' },
    { id: '24', fullName: 'Ximena Andrade Siqueira', phone: '61955432109', cpf: '54123456723', cep: '70060010' },
    { id: '25', fullName: 'Yasmin Priscila Nunes', phone: '71944321098', cpf: '65123456734', cep: '40030010' },
  ];

  getClientes(): Observable<IClientes[]> {
    return of(this.mockData).pipe(delay(300));
  }
}
