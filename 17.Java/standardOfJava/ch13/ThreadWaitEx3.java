import java.util.ArrayList;

class Customer implements Runnable {
	private Table table;
	private String food;

	Customer(Table table, String food) {
		this.table = table;  
		this.food  = food;
	}

	public void run() {
		while(true) {
			try { Thread.sleep(100);} catch(InterruptedException e) {}
			String name = Thread.currentThread().getName();
			
			table.remove(food);
			System.out.println(name + " ate a " + food);
		} // while
	}
}

class Cook implements Runnable {
	private Table table;
	
	Cook(Table table) {	this.table = table; }

	public void run() {
		while(true) {
			int idx = (int)(Math.random()*table.dishNum());
			table.add(table.dishNames[idx]);
			try { Thread.sleep(10);} catch(InterruptedException e) {}
		} // while
	}
}

class Table {
	String[] dishNames = { "donut","donut","burger" }; // donut�� Ȯ���� ���δ�.
	final int MAX_FOOD = 6;
	private ArrayList<String> dishes = new ArrayList<>();

	public synchronized void add(String dish) {
		while(dishes.size() >= MAX_FOOD) {
				String name = Thread.currentThread().getName();
				System.out.println(name+" is waiting.");
				try {
					wait(); // wait
					Thread.sleep(500);
				} catch(InterruptedException e) {}	
		}
		dishes.add(dish);
		notify();  // notify : 
		System.out.println("Dishes:" + dishes.toString());
	}

	public void remove(String dishName) {
		synchronized(this) {	
			String name = Thread.currentThread().getName();

			while(dishes.size()==0) {
					System.out.println(name+" is waiting.");
					try {
						// 요리사 스레드가 notify해주기를 대기
						wait(); 
						Thread.sleep(500);
					} catch(InterruptedException e) {}	
			}

			while(true) {
				for(int i=0; i<dishes.size();i++) {
					if(dishName.equals(dishes.get(i))) {
						dishes.remove(i);
						// 객체(요리사 쓰레드 포함)에게 먹었음을 알림
						notify(); 
						return;
					}
				} // for���� ��

				try {
					System.out.println(name+" is waiting.");
					// 요리사 스레드가 notify해주기를 대기
					wait();
					Thread.sleep(500);
				} catch(InterruptedException e) {}	
			} // while(true)
		} // synchronized
	}

	public int dishNum() { return dishNames.length; }
}

class ThreadWaitEx3 {
	public static void main(String[] args) throws Exception {
		Table table = new Table();

		new Thread(new Cook(table), "COOK1").start();
		new Thread(new Customer(table, "donut"),  "CUST1").start();
		new Thread(new Customer(table, "burger"), "CUST2").start();
	
		Thread.sleep(2000);
		System.exit(0);
	}
}