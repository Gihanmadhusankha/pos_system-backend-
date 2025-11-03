
import { Brackets, Repository } from "typeorm";
import { AppDataSource } from "../../configuration/database-configuration";
import { CreateOrderDTO } from "../../dto/order-dto/createOrder-dto";
import { Order } from "../../entity/Order";
import { OrderStatus } from "../../enum/orderStatus";
import { Status } from "../../enum/status";
import { OrderDao } from "../orederDao";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";
import { loadRequestDTO } from "../../dto/loadRequest-dto";
import { User } from "../../entity/User";



export class OrderDaoImpl implements OrderDao {

    async createOrder(order: CreateOrderDTO, orderRepo: Repository<Order>): Promise<Order> {
        let orderEnttity: Order = new Order();
        orderEnttity.orderNumber = "ORD-" + Date.now();
        orderEnttity.orderStatus = OrderStatus.DRAFT;
        orderEnttity.created_at = new Date();

        return orderEnttity;
    }


    async save(order: Order, orderRepo: Repository<Order>): Promise<Order> {

        order.updated_at = new Date();
        return await orderRepo.save(order);
    }


    async findOrderById(orderId: number): Promise<Order | null> {

        const orderRepo: Repository<Order> = AppDataSource.getRepository(Order);
        return await orderRepo.findOne({ where: { orderId } });


    }
    async listOrder(paginationDto: CommonPaginationDto, userId: number): Promise<{list:Order[]; count:number} > {


        const orderRepo: Repository<Order> = AppDataSource.getRepository(Order);
        let query = orderRepo.createQueryBuilder("order")
            .leftJoinAndSelect("order.customer", "customer")
            .leftJoinAndSelect("order.user", "user")
            .leftJoinAndSelect("order.orderItem", "orderItem")
            .leftJoinAndSelect("orderItem.product", "product")
            .where("order.status = :status", { status: Status.ONLINE })
            .andWhere("user.userId = :userId", { userId })


        if (paginationDto.getSearchText()) {

            const searchTerm = paginationDto.getSearchText().trim().toLowerCase();
            query.andWhere(new Brackets((and) => {
                and.orWhere("LOWER(order.orderNumber) LIKE :search", { search: `%${searchTerm}%` });
                and.orWhere("LOWER(customer.name) LIKE :name", { name: `%${searchTerm}%` })
            })

            );
        }

        if (paginationDto.isStatus()) {
            query.andWhere("order.orderStatus = :orderStatus", { orderStatus: paginationDto.isStatus() });
        }
        const fromDate = paginationDto.getFromDate();
        const toDate = paginationDto.getToDate();

        if (fromDate && toDate) {

            const start = new Date(fromDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);

            query.andWhere("order.created_at BETWEEN :from AND :to", {
                from: start,
                to: end,
            });
        } else if (fromDate) {
            const start = new Date(fromDate);
            start.setHours(0, 0, 0, 0);
            query.andWhere("order.created_at >= :from", { from: start });
        } else if (toDate) {
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
            query.andWhere("order.created_at <= :to", { to: end });
        }




        if (paginationDto.isIsReqPagination()) {
            query.skip(paginationDto.getStartIndex());
            query.take(paginationDto.getMaxResult());
        }

        const [list, count] = await query.getManyAndCount();

        return { list, count };
    }


    async findOrder(loadRequest: loadRequestDTO): Promise<Order | null> {
        const orderRepo: Repository<Order> = AppDataSource.getRepository(Order);

        const query = orderRepo.createQueryBuilder("order");

        if (loadRequest.getId()) {
            query.where("order.orderId = :id", { id: loadRequest.getId() });
        }

        const customer = await query.getOne();
        return customer;
    }


}


